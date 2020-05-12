from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.expected_conditions import url_changes
from django.test import LiveServerTestCase
from .models import Tournament, Participation


class TournamentsBackendTests(APITestCase):
    def setUp(self):
        userdata = {
            "username": "test",
            "email": "",
            "password": "test"
        }
        self.client.post("/api/auth/register", userdata, format='json')
        self.user = User.objects.get(username="test")
        self.client.login(username='test', password='test')
        self.client.force_authenticate(user=self.user)

    def create_tournament(self, name):
        return Tournament.objects.create(name=name, city="test", address="Testowa 5",
                                         draw_size=2, description="test",
                                         organizer=self.user, date="2021-10-10")

    def create_expired_tournament(self, name):
        return Tournament.objects.create(name=name, city="test", address="Testowa 5",
                                         draw_size=64, description="test",
                                         organizer=self.user, date="2019-10-10")

    def test_create_tournament_with_correct_data(self):
        tournament = {
            "name": "test_tournament",
            "city": "Wrocław",
            "address": "Testowa 5",
            "date": "2021-05-07",
            "draw_size": "32",
            "description": "test tournament"
        }
        response = self.client.post("/api/tournament/create",
                                    tournament,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_two_tournaments_with_same_name(self):
        tournament = {
            "name": "test_tournament",
            "city": "Wrocław",
            "address": "Testowa 5",
            "date": "2021-05-07",
            "draw_size": "32",
            "description": "test tournament"
        }
        response = self.client.post("/api/tournament/create",
                                    tournament,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post("/api/tournament/create",
                                    tournament,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tournament_with_draw_size_not_power_of_two(self):
        tournament = {
            "name": "test_tournament",
            "city": "Wrocław",
            "address": "Testowa 5",
            "date": "2021-05-07",
            "draw_size": "42",
            "description": "test tournament"
        }
        response = self.client.post("/api/tournament/create",
                                    tournament,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tournament_with_wrong_address(self):
        tournament = {
            "name": "test_tournament",
            "city": "Wrocław",
            "address": "235",
            "date": "2021-05-07",
            "draw_size": "42",
            "description": "test tournament"
        }
        response = self.client.post("/api/tournament/create",
                                    tournament,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tournament_with_wrong_date(self):
        tournament = {
            "name": "test_tournament",
            "city": "Wrocław",
            "address": "235",
            "date": "2019-05-07",
            "draw_size": "42",
            "description": "test tournament"
        }
        response = self.client.post("/api/tournament/create",
                                    tournament,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_join_tournament_without_login(self):
        self.client.logout()
        tournament = self.create_tournament("test")
        tournament_data = {
            "tournament": tournament.id
        }
        response = self.client.post("/api/tournament/participate",
                                    tournament_data,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_join_tournament_with_login(self):
        tournament = self.create_tournament("test")
        tournament_data = {
            "tournament": tournament.id
        }
        response = self.client.post("/api/tournament/participate",
                                    tournament_data,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_join_not_existing_tournament(self):
        tournament_data = {
            "tournament": "9999"
        }
        response = self.client.post("/api/tournament/participate",
                                    tournament_data,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], "Taki turniej nie istnieje")

    def test_join_expired_tournament(self):
        tournament = self.create_expired_tournament("test2")
        tournament_data = {
            "tournament": tournament.id
        }
        response = self.client.post("/api/tournament/participate",
                                    tournament_data,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)
        self.assertEqual(response.data['message'], "Zapisy zostały zakończone")

    def test_join_full_tournament(self):
        tournament = self.create_tournament("test3")
        tournament_data = {
            "tournament": tournament.id
        }
        user1 = User.objects.create_user(username="user1", password="user1")
        user2 = User.objects.create_user(username="user2", password="user2")
        Participation.objects.create(tournament=tournament, player=user1)
        Participation.objects.create(tournament=tournament, player=user2)
        response = self.client.post("/api/tournament/participate",
                                    tournament_data,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)
        self.assertEqual(response.data['message'], "Brak wolnych miejsc")

    def test_leave_tournament(self):
        tournament = self.create_tournament("test4")
        Participation.objects.create(tournament=tournament, player=self.user)
        tournament_data = {
            "tournament": tournament.id
        }
        response = self.client.delete("/api/tournament/participate",
                                      tournament_data,
                                      format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leave_tournament_without_participation(self):
        tournament = self.create_tournament("test4")
        tournament_data = {
            "tournament": tournament.id
        }
        response = self.client.delete("/api/tournament/participate",
                                      tournament_data,
                                      format='json')
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)
        self.assertEqual(response.data['message'], "Nie byłeś zapisany do tego turnieju")

    def test_leave_expired_tournament(self):
        tournament = self.create_expired_tournament("test5")
        tournament_data = {
            "tournament": tournament.id
        }
        Participation.objects.create(tournament=tournament, player=self.user)
        response = self.client.delete("/api/tournament/participate",
                                      tournament_data,
                                      format='json')
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)
        self.assertEqual(response.data['message'], "Czas wypisów z tego turneju już minął")


class TournamentsFrontendTests(LiveServerTestCase):
    __url = "http://127.0.0.1:8000/#/"

    def setUp(self):
        self.driver = webdriver.Chrome()

    def tearDown(self):
        self.driver.close()

    def login(self):
        url = self.__url + "logowanie"
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

    def test_create_tournament_with_correct_data(self):
        self.login()
        url = self.__url + "utworz_turniej"
        self.driver.get(url)
        self.driver.find_element_by_name("name").send_keys("test")
        self.driver.find_element_by_name("city").send_keys("test")
        self.driver.find_element_by_name("address").send_keys("Testowa 5")
        self.driver.find_element_by_name("date").send_keys("2021")
        self.driver.find_element_by_name("date").send_keys(Keys.RIGHT)
        self.driver.find_element_by_name("date").send_keys("10")
        self.driver.find_element_by_name("date").send_keys(Keys.RIGHT)
        self.driver.find_element_by_name("date").send_keys("10")
        self.driver.find_element_by_name("drawSize").send_keys("32")
        self.driver.find_element_by_name("description").send_keys("test")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/form/div[7]/button").click()
