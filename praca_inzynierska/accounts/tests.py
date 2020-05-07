from django.contrib.auth.models import User
from django.test import LiveServerTestCase
from rest_framework import status
from rest_framework.test import APITestCase
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.expected_conditions import url_changes
from selenium.webdriver.support.ui import WebDriverWait
from .models import TennisProfile


class AccountBackendTests(APITestCase):
    def register_user(self):
        userdata = {
            "username": "test",
            "email": "",
            "password": "test"
        }
        self.client.post("/api/auth/register", userdata, format='json')

    def test_create_account_correct(self):
        user = {
            "username": "test",
            "email": "",
            "password": "test"
        }

        self.assertEqual(User.objects.count(), 0)
        response = self.client.post("/api/auth/register", user, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    def test_create_two_accounts_with_same_username(self):
        user = {
            "username": "test",
            "email": "",
            "password": "test"
        }

        self.assertEqual(User.objects.count(), 0)
        response = self.client.post("/api/auth/register", user, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post("/api/auth/register", user, format='json')
        self.assertEqual(User.objects.count(), 1)

    def test_login_with_correct_data(self):
        User.objects.create_user(username="test", password="test")
        user = {
            "username": "test",
            "password": "test"
        }

        response = self.client.post("/api/auth/login", user, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data['token'])

    def test_login_with_incorrect_login(self):
        User.objects.create_user(username="test", password="test")
        user = {
            "username": "Test",
            "password": "test"
        }

        response = self.client.post("/api/auth/login", user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_incorrect_password(self):
        User.objects.create_user(username="test", password="test")
        user = {
            "username": "test",
            "password": "test1"
        }

        response = self.client.post("/api/auth/login", user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_new_tennis_profile(self):
        self.register_user()
        user = User.objects.get(username="test")
        self.client.login(username='test', password='test')
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/user/tennis_profile").data

        self.assertIsNone(response['residence'])
        self.assertIsNone(response['birth_date'])
        self.assertIsNone(response['weight'])
        self.assertIsNone(response['height'])
        self.assertIsNone(response['forehand'])
        self.assertIsNone(response['backhand'])

    def test_update_tennis_profile_with_credentials_and_correct_data(self):
        self.register_user()
        user = User.objects.get(username="test")
        self.client.login(username='test', password='test')
        self.client.force_authenticate(user=user)

        data = {
            "residence": "Wroclaw",
            "weight": "60",
            "height": "170",
            "forehand": "LEFT",
            "backhand": "",
            "birth_date": "",
        }
        self.client.put("/api/user/tennis_profile", data, format="json")
        tennis_profile = TennisProfile.objects.get(user_id=user.id)

        self.assertEqual(tennis_profile.residence, "Wroclaw")
        self.assertIsNone(tennis_profile.birth_date)
        self.assertEqual(tennis_profile.weight, 60)
        self.assertEqual(tennis_profile.height, 170)
        self.assertEqual(tennis_profile.forehand, "LEFT")

    def test_update_tennis_profile_with_credentials_and_incorrect_data(self):
        self.register_user()
        user = User.objects.get(username="test")
        self.client.login(username='test', password='test')
        self.client.force_authenticate(user=user)

        data = {
            "residence": "Wroclaw",
            "weight": "60",
            "height": "170",
            "forehand": "LEFT2",
            "backhand": "",
            "birth_date": "",
        }
        self.client.put("/api/user/tennis_profile", data, format="json")
        tennis_profile = TennisProfile.objects.get(user_id=user.id)

        self.assertIsNone(tennis_profile.residence)
        self.assertIsNone(tennis_profile.birth_date)
        self.assertIsNone(tennis_profile.weight)
        self.assertIsNone(tennis_profile.height)
        self.assertIsNone(tennis_profile.forehand)
        self.assertIsNone(tennis_profile.backhand)

    def test_update_tennis_profile_without_credentials(self):
        data = {
            "residence": "Wroclaw",
            "weight": "60",
            "height": "170",
            "forehand": "LEFT",
            "backhand": "",
            "birth_date": "",
        }
        response = self.client.put("/api/user/tennis_profile",
                                   data, format="json")
        self.assertEqual(response.status_code, 401)

    def test_update_user_profile_with_credentials(self):
        self.register_user()
        user = User.objects.get(username="test")
        self.client.login(username='test', password='test')
        self.client.force_authenticate(user=user)

        data = {
            "first_name": "Janusz",
            "last_name": "",
            "email": "test@test.pl",
            "username": "test"
        }
        self.client.put("/api/user/profile", data, format="json")
        user = User.objects.get(username="test")
        self.assertEqual(user.first_name, "Janusz")
        self.assertEqual(user.email, "test@test.pl")

    def test_update_user_profile_without_credentials(self):
        data = {
            "first_name": "Janusz",
            "last_name": "",
            "email": "test@test.pl",
            "username": "test"
        }
        response = self.client.put("/api/user/profile", data, format="json")
        self.assertEqual(response.status_code, 401)


class AccountFrontendTests(LiveServerTestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()

    def tearDown(self):
        self.driver.close()

    def test_login_correct(self):
        url = "http://127.0.0.1:8000/#/login"
        self.driver.get(url)
        username = self.driver.find_element_by_name("username")
        password = self.driver.find_element_by_name("password")
        username.send_keys("Kamil")
        password.send_keys("12345")
        submit = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ \
                                                    form/div[3]/button")
        submit.send_keys(Keys.RETURN)
        wait = WebDriverWait(self.driver, 2)
        wait.until(url_changes(url))
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:8000/#/")

    def test_login_incorrect(self):
        url = "http://127.0.0.1:8000/#/login"
        self.driver.get(url)
        username = self.driver.find_element_by_name("username")
        password = self.driver.find_element_by_name("password")
        username.send_keys("test")
        password.send_keys("12345")
        submit = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ \
                                                    form/div[3]/button")
        submit.send_keys(Keys.RETURN)
        wait = WebDriverWait(self.driver, 2)
        try:
            self.assertEqual(wait.until(url_changes(url)), False)
        except TimeoutException:
            pass

    def test_register_with_existing_username(self):
        url = "http://127.0.0.1:8000/#/register"
        self.driver.get(url)
        username = self.driver.find_element_by_name("username")
        password = self.driver.find_element_by_name("password")
        password2 = self.driver.find_element_by_name("password2")
        username.send_keys("Kamil")
        password.send_keys("12345")
        password2.send_keys("12345")
        submit = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ \
                                                    form/div[5]/button")
        submit.send_keys(Keys.RETURN)
        wait = WebDriverWait(self.driver, 2)
        try:
            self.assertEqual(wait.until(url_changes(url)), False)
        except TimeoutException:
            pass

    def test_profile_manage_without_login(self):
        url = "http://127.0.0.1:8000/#/"
        self.driver.get(url)
        self.assertEqual(self.driver.current_url, url)
        url = "http://127.0.0.1:8000/#/profile"
        self.driver.get(url)
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:8000/#/login")

    def test_update_user_profile(self):
        url = "http://127.0.0.1:8000/#/login"
        self.driver.get(url)
        username = self.driver.find_element_by_name("username")
        password = self.driver.find_element_by_name("password")
        username.send_keys("janek")
        password.send_keys("12345")
        submit = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ \
                                                    form/div[3]/button")
        submit.send_keys(Keys.RETURN)
        wait = WebDriverWait(self.driver, 2)
        wait.until(url_changes(url))
        url = "http://127.0.0.1:8000/#/profile"
        self.driver.get(url)
        self.assertEqual(self.driver.current_url, url)
        self.driver.implicitly_wait(2)
        first_name = self.driver.find_element_by_name("firstName")
        last_name = self.driver.find_element_by_name("lastName")
        first_name.clear()
        first_name.send_keys("Jan")
        last_name.clear()
        last_name.send_keys("Kowalski")
        submit = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[1]/ \
                                                    div/form/div[4]/button")
        submit.send_keys(Keys.RETURN)
        self.driver.refresh()
        self.assertEqual(self.driver.find_element_by_name("firstName")
                                    .get_attribute('value'), "Jan")
        self.assertEqual(self.driver.find_element_by_name("lastName")
                                    .get_attribute('value'), "Kowalski")

    def test_update_tennis_profile(self):
        url = "http://127.0.0.1:8000/#/login"
        self.driver.get(url)
        username = self.driver.find_element_by_name("username")
        password = self.driver.find_element_by_name("password")
        username.send_keys("janek")
        password.send_keys("12345")
        submit = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ \
                                                    form/div[3]/button")
        submit.send_keys(Keys.RETURN)
        wait = WebDriverWait(self.driver, 2)
        wait.until(url_changes(url))
        url = "http://127.0.0.1:8000/#/profile"
        self.driver.get(url)
        self.assertEqual(self.driver.current_url, url)
        self.driver.implicitly_wait(2)
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ul/li[2]/a").click()
        height = self.driver.find_element_by_name("height")
        weight = self.driver.find_element_by_name("weight")
        residence = self.driver.find_element_by_name("residence")
        height.clear()
        height.send_keys("179")
        weight.clear()
        weight.send_keys("72")
        residence.clear()
        residence.send_keys("Wrocław")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[2] \
                                           /div/form/div[7]/button").click()
        self.driver.refresh()
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ul/li[2]/a").click()
        self.assertEqual(self.driver.find_element_by_name("height")
                                    .get_attribute('value'), "179")
        self.assertEqual(self.driver.find_element_by_name("weight")
                                    .get_attribute('value'), "72")
        self.assertEqual(self.driver.find_element_by_name("residence")
                                    .get_attribute('value'), "Wrocław")
