from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.expected_conditions import url_changes
from django.test import LiveServerTestCase
from webdriver_manager.chrome import ChromeDriverManager
from .models import Tournament, Participation, Match
import datetime


class TournamentsBackendTests(APITestCase):
    def setUp(self):
        userdata = {
            "username": "test",
            "email": "",
            "first_name": "Kamil",
            "last_name": "Woś",
            "password": "test"
        }
        self.client.post("/api/auth/register", userdata, format='json')
        self.user = User.objects.get(username="test")
        self.client.login(username='test', password='test')
        self.client.force_authenticate(user=self.user)

    def register_user(self, name):
        userdata = {
            "username": name,
            "email": "",
            "first_name": "Janusz",
            "last_name": "Testowy",
            "password": "test"
        }
        self.client.post("/api/auth/register", userdata, format='json')

    def create_tournament(self, name):
        return Tournament.objects.create(name=name, city="test", address="Testowa 5",
                                         draw_size=2, description="test",
                                         organizer=self.user, date="2021-10-10",
                                         end_of_registration="2021-10-01", accepted=True)

    def create_expired_tournament(self, name):
        return Tournament.objects.create(name=name, city="test", address="Testowa 5",
                                         draw_size=64, description="test",
                                         organizer=self.user, date="2019-10-10",
                                         end_of_registration="2018-10-01", accepted=True)

    def create_not_accepted_tournament(self, name):
        return Tournament.objects.create(name=name, city="test", address="Testowa 5",
                                         draw_size=2, description="test",
                                         organizer=self.user, date="2021-10-10",
                                         end_of_registration="2021-10-01", accepted=False)

    def create_tournament_with_ended_registration(self, name):
        return Tournament.objects.create(name=name, city="test", address="Testowa 5",
                                         draw_size=2, description="test",
                                         organizer=self.user, date="2021-10-10",
                                         end_of_registration="2019-10-01", accepted=True)

    def test_create_tournament_with_correct_data(self):
        tournament = {
            "name": "test_tournament",
            "city": "Wrocław",
            "address": "Testowa 5",
            "date": "2021-05-07",
            "end_of_registration": "2021-05-05",
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
            "end_of_registration": "2021-05-01",
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
            "end_of_registration": "2021-05-01",
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
            "end_of_registration": "2021-05-01",
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
            "end_of_registration": "2019-05-01",
            "draw_size": "42",
            "description": "test tournament"
        }
        response = self.client.post("/api/tournament/create",
                                    tournament,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tournament_with_wrong_end_of_registration_date(self):
        tournament = {
            "name": "test_tournament",
            "city": "Wrocław",
            "address": "235",
            "date": "2019-05-07",
            "end_of_registration": "2020-05-01",
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

    def test_join_not_accepted_tournament(self):
        tournament = self.create_not_accepted_tournament("test7")
        tournament_data = {
            "tournament": tournament.id
        }
        response = self.client.post("/api/tournament/participate",
                                    tournament_data,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], "Taki turniej nie istnieje")

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
        tournament = self.create_tournament("test6")
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

    def test_get_existing_tournament(self):
        tournament = self.create_tournament("test8")
        response = self.client.get("/api/tournament/{id}".format(id=tournament.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_not_existing_tournament(self):
        response = self.client.get("/api/tournament/{id}".format(id=589127))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_incoming_tournaments_page(self):
        self.create_tournament("test1")
        self.create_tournament("test2")
        self.create_tournament("test3")
        self.create_tournament("test4")
        response = self.client.get("/api/tournaments/incoming/page/1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["tournaments"]), 4)
        self.assertEqual(response.data["hasMore"], False)

    def test_get_history_tournaments_page(self):
        self.create_expired_tournament("test1")
        self.create_expired_tournament("test2")
        self.create_expired_tournament("test3")
        self.create_expired_tournament("test4")
        response = self.client.get("/api/tournaments/history/page/1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["tournaments"]), 4)
        self.assertEqual(response.data["hasMore"], False)

    def test_get_incoming_tournaments_second_page(self):
        for i in range(1, 30):
            self.create_tournament("test{number}".format(number=i))
        response1 = self.client.get("/api/tournaments/incoming/page/1")
        response2 = self.client.get("/api/tournaments/incoming/page/2")
        self.assertEqual(response1.data["hasMore"], True)
        self.assertEqual(len(response1.data["tournaments"]), 25)
        self.assertEqual(response2.data["hasMore"], False)
        self.assertEqual(len(response2.data["tournaments"]), 4)

    def test_get_history_tournaments_second_page(self):
        for i in range(1, 30):
            self.create_expired_tournament("test{number}".format(number=i))
        response1 = self.client.get("/api/tournaments/history/page/1")
        response2 = self.client.get("/api/tournaments/history/page/2")
        self.assertEqual(response1.data["hasMore"], True)
        self.assertEqual(len(response1.data["tournaments"]), 25)
        self.assertEqual(response2.data["hasMore"], False)
        self.assertEqual(len(response2.data["tournaments"]), 4)

    def test_get_tournament_participants(self):
        tournament = self.create_tournament("test3")
        user1 = User.objects.create_user(username="user1", password="user1")
        user2 = User.objects.create_user(username="user2", password="user2")
        Participation.objects.create(tournament=tournament, player=user1)
        Participation.objects.create(tournament=tournament, player=user2)
        response = self.client.get("/api/tournament/participants/{id}".format(id=tournament.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["participants"]), 2)

    def test_get_not_existing_tournament_participants(self):
        response = self.client.get("/api/tournament/participants/12512")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_not_existing_tournament_matches(self):
        response = self.client.get("/api/tournament/12512/matches")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_tournament_matches(self):
        tournament = self.create_tournament("test3")
        user1 = User.objects.create_user(username="user1", password="user1")
        user2 = User.objects.create_user(username="user2", password="user2")
        Match.objects.create(player1=user1, player2=user2, tournament=tournament, 
                             round=1, match_number=1, date="2020-12-12")
        response = self.client.get("/api/tournament/{id}/matches".format(id=tournament.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["matches"]), 1)

    def test_get_existing_match(self):
        tournament = self.create_tournament("test3")
        self.register_user("user1")
        self.register_user("user2")
        user1 = User.objects.get(username="user1")
        user2 = User.objects.get(username="user2")
        match = Match.objects.create(player1=user1, player2=user2, tournament=tournament, 
                                     round=1, match_number=1, date="2020-12-12")
        response = self.client.get("/api/tournament/match/{id}".format(id=match.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["match"]["id"], match.id)
        self.assertEqual(response.data["match"]["tournament"]["id"], tournament.id)
        self.assertEqual(response.data["match"]["player1"]["id"], user1.id)
        self.assertEqual(response.data["match"]["player2"]["id"], user2.id)

    def test_get_not_existing_match(self):
        response = self.client.get("/api/tournament/match/1251")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_tournament_organizer(self):
        tournament = self.create_tournament("test3")
        response = self.client.get("/api/tournament/{id}/organizer".format(id=tournament.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["organizer"], self.user.id)

    def test_get_organizer_of_not_existing_tournament(self):
        response = self.client.get("/api/tournament/2579128571/organizer")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_start_tournament_before_end_of_registration(self):
        tournament = self.create_tournament("test3")
        response = self.client.get("/api/tournament/{id}/start".format(id=tournament.id))
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_start_tournament_after_end_of_registration(self):
        tournament = self.create_tournament_with_ended_registration("test3")
        response = self.client.get("/api/tournament/{id}/start".format(id=tournament.id))
        tournament = Tournament.objects.get(id=tournament.id)
        tournament_matches_number = Match.objects.filter(tournament=tournament).count()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(tournament.started, True)        
        self.assertEqual(tournament_matches_number, tournament.draw_size - 1)

    def test_start_already_started_tournament(self):
        tournament = Tournament.objects.create(name="test", city="test", address="Testowa 5",
                                               draw_size=2, description="test", started=True,
                                               organizer=self.user, date="2021-10-10",
                                               end_of_registration="2019-10-01", accepted=True)
        response = self.client.get("/api/tournament/{id}/start".format(id=tournament.id))
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_start_tournament_without_organizer_privilege(self):
        self.register_user("user1")
        user = User.objects.get(username="user1")
        tournament = Tournament.objects.create(name="test", city="test", address="Testowa 5",
                                               draw_size=2, description="test", started=True,
                                               organizer=user, date="2021-10-10",
                                               end_of_registration="2019-10-01", accepted=True)
        response = self.client.get("/api/tournament/{id}/start".format(id=tournament.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["message"], "Nie jesteś organizatorem turnieju")

    def test_start_not_existing_tournament(self):
        response = self.client.get("/api/tournament/572189571/start")
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_get_player_matches(self):
        tournament = self.create_tournament("test3")
        self.register_user("user1")
        user = User.objects.get(username="user1")
        Match.objects.create(player1=self.user, player2=user, tournament=tournament, 
                             round=1, match_number=1, date="2020-12-12")
        response = self.client.get("/api/player/{id}/matches/1".format(id=self.user.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["matches"]), 1)

    def test_get_matches_of_not_existing_player(self):
        response = self.client.get("/api/player/12958/matches/1")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_players_ranking(self):
        self.register_user("user1")
        user1 = User.objects.get(username="user1")
        self.register_user("user2")
        user2 = User.objects.get(username="user2")
        tournament = self.create_tournament("test3")
        Match.objects.create(player1=self.user, player2=user1, tournament=tournament, 
                             round=1, match_number=1, date="2019-12-12", score="6:0 6:0")
        Match.objects.create(player1=user2, player2=self.user, tournament=tournament, 
                             round=2, match_number=2, date="2019-12-12", score="6:0 6:0")
        response = self.client.get("/api/ranking")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["ranking"]), 2)
        self.assertEqual(response.data["ranking"][0]["id"], user2.id)
        self.assertEqual(response.data["ranking"][1]["id"], self.user.id)
        self.assertEqual(response.data["ranking"][0]["points"], 20)
        self.assertEqual(response.data["ranking"][1]["points"], 10)
        self.assertEqual(response.data["start_date"], (datetime.datetime.now() - datetime.timedelta(days=365)).strftime("%Y-%m-%d"))
        self.assertEqual(response.data["end_date"], datetime.datetime.now().strftime("%Y-%m-%d"))

    def test_update_match(self):
        self.register_user("user1")
        user = User.objects.get(username="user1")
        tournament = self.create_tournament("test3")
        match = Match.objects.create(player1=self.user, player2=None, tournament=tournament, 
                                     round=1, match_number=1, date="2019-12-12", score="")
        match_data = {
            "player1": self.user.id,
            "player2": user.id,
            "score": "6:0 6:0",
            "time": "15:30"
        }
        response = self.client.put("/api/tournament/match/{id}".format(id=match.id), match_data, format='json')
        match = Match.objects.get(id=match.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(match.score, "6:0 6:0")
        self.assertEqual(match.player2.id, user.id)
        self.assertEqual(match.time.strftime("%H:%M"), "15:30")

    def test_update_not_existing_match(self):
        self.register_user("user1")
        user = User.objects.get(username="user1")
        match_data = {
            "player1": self.user.id,
            "player2": user.id,
            "score": "6:0 6:0",
            "time": "15:30"
        }
        response = self.client.put("/api/tournament/match/5125", match_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_match_without_organizer_privilege(self):
        self.register_user("user1")
        user = User.objects.get(username="user1")
        tournament = Tournament.objects.create(name="test", city="test", address="Testowa 5",
                                               draw_size=2, description="test", started=True,
                                               organizer=user, date="2021-10-10",
                                               end_of_registration="2019-10-01", accepted=True)
        match = Match.objects.create(player1=self.user, player2=None, tournament=tournament, 
                                     round=1, match_number=1, date="2019-12-12", score="")
        match_data = {
            "player1": self.user.id,
            "player2": user.id,
            "score": "6:0 6:0",
            "time": "15:30"
        }
        response = self.client.put("/api/tournament/match/{id}".format(id=match.id), match_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_update_match_with_wrong_score(self):
        self.register_user("user1")
        user = User.objects.get(username="user1")
        tournament = self.create_tournament("test3")
        match = Match.objects.create(player1=self.user, player2=None, tournament=tournament, 
                                     round=1, match_number=1, date="2019-12-12", score="")
        match_data = {
            "player1": self.user.id,
            "player2": user.id,
            "score": "6:6 6:0",
            "time": "15:30"
        }
        response = self.client.put("/api/tournament/match/{id}".format(id=match.id), match_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_main_page_tournaments(self):
        self.create_tournament("test1")
        self.create_tournament("test2")
        self.create_tournament("test3")
        self.create_tournament("test4")
        self.create_tournament("test5")
        response = self.client.get("/api/tournaments/main_page")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["tournaments"]), 3)

    def test_get_main_page_tournaments_without_incoming_tournaments(self):
        self.create_expired_tournament("test1")
        self.create_expired_tournament("test2")
        self.create_expired_tournament("test3")
        self.create_not_accepted_tournament("test4")
        self.create_not_accepted_tournament("test5")
        response = self.client.get("/api/tournaments/main_page")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["tournaments"]), 0)


class TournamentsFrontendTests(LiveServerTestCase):
    _url = "http://127.0.0.1:8000/#/"

    def setUp(self):
        self.driver = webdriver.Chrome(ChromeDriverManager().install())
        self.driver.maximize_window()
        self.driver.implicitly_wait(3)

    def tearDown(self):
        self.driver.close()

    def login(self):
        url = self._url + "logowanie"
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
        url = self._url + "utworz_turniej"
        self.driver.get(url)
        self.driver.find_element_by_name("name").send_keys("test")
        self.driver.find_element_by_name("city").send_keys("test")
        self.driver.find_element_by_name("address").send_keys("Testowa 5")
        self.driver.find_element_by_name("date").send_keys("2021")
        self.driver.find_element_by_name("date").send_keys(Keys.RIGHT)
        self.driver.find_element_by_name("date").send_keys("10")
        self.driver.find_element_by_name("date").send_keys(Keys.RIGHT)
        self.driver.find_element_by_name("date").send_keys("10")
        self.driver.find_element_by_name("endOfRegistration").send_keys("2021")
        self.driver.find_element_by_name("endOfRegistration").send_keys(Keys.RIGHT)
        self.driver.find_element_by_name("endOfRegistration").send_keys("10")
        self.driver.find_element_by_name("endOfRegistration").send_keys(Keys.RIGHT)
        self.driver.find_element_by_name("endOfRegistration").send_keys("1")
        self.driver.find_element_by_name("drawSize").send_keys("32")
        self.driver.find_element_by_name("description").send_keys("test")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/form/div[8]/button").click()

    def test_incoming_tournaments_presence(self):
        self.driver.get(self._url)
        self.driver.find_element_by_xpath("/html/body/div[1]/nav/div/div/ul/li[2]").click()
        wait = WebDriverWait(self.driver, 2)
        wait.until(url_changes(self._url))
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:8000/#/turnieje")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[1]/div/div/div/table/tbody/tr")

    def test_history_tournaments_presence(self):
        self.driver.get(self._url)
        self.driver.find_element_by_xpath("/html/body/div[1]/nav/div/div/ul/li[2]").click()
        wait = WebDriverWait(self.driver, 2)
        wait.until(url_changes(self._url))
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:8000/#/turnieje")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ul/li[2]").click()
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[2]/div/div/div/table/tbody/tr")

    def test_players_ranking_presence(self):
        self.driver.get(self._url)
        self.driver.find_element_by_xpath("/html/body/div[1]/nav/div/div/ul/li[4]").click()
        wait = WebDriverWait(self.driver, 2)
        wait.until(url_changes(self._url))
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:8000/#/ranking")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/table/tbody/tr")
        dates = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/h6").text
        start_date = (datetime.datetime.now() - datetime.timedelta(days=365)).strftime("%Y-%m-%d")
        end_date = datetime.datetime.now().strftime("%Y-%m-%d")
        self.assertEqual(dates, "{start} - {end}".format(start=start_date, end=end_date))

    def test_tournaments_join_and_leave(self):
        self.login()
        self.driver.get(self._url)
        self.driver.find_element_by_xpath("/html/body/div[1]/nav/div/div/ul/li[2]").click()
        wait = WebDriverWait(self.driver, 2)
        wait.until(url_changes(self._url))
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:8000/#/turnieje")
        join_buttons = self.driver.find_elements_by_xpath("//button[contains(text(), 'Zapisz się')]")
        tournaments_number = len(join_buttons)
        for join_btn in join_buttons:
            join_btn.click()

        leave_buttons = self.driver.find_elements_by_xpath("//button[contains(text(), 'Opuść turniej')]")
        self.assertEqual(tournaments_number, len(leave_buttons))
        for leave_btn in leave_buttons:
            leave_btn.click()

        join_buttons = self.driver.find_elements_by_xpath("//button[contains(text(), 'Zapisz się')]")
        self.assertEqual(tournaments_number, len(join_buttons))

    def test_my_tournaments_presence(self):
        self.login()
        self.driver.get(self._url)
        self.driver.find_element_by_xpath("/html/body/div[1]/nav/div/ul/li").click()
        self.driver.find_element_by_xpath("/html/body/div[1]/nav/div/ul/li/div/a[3]").click()
        wait = WebDriverWait(self.driver, 2)
        wait.until(url_changes(self._url))
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:8000/#/moje_turnieje")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/table/tbody/tr")

    def test_my_matches_presence(self):
        self.login()
        self.driver.get(self._url)
        self.driver.find_element_by_xpath("/html/body/div[1]/nav/div/ul/li").click()
        self.driver.find_element_by_xpath("/html/body/div[1]/nav/div/ul/li/div/a[2]").click()
        wait = WebDriverWait(self.driver, 2)
        wait.until(url_changes(self._url))
        self.assertEqual(self.driver.current_url, "http://127.0.0.1:8000/#/gracz/12")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div[2]/div/div/table/tbody/tr[1]")

    def test_match_view(self):
        self.driver.get("http://127.0.0.1:8000/#/mecz/1")
        player1 = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[1]/h3").text
        player2 = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[3]/h3").text
        score = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[2]/h2").text
        self.assertEqual(player1, "Kamil Woś")
        self.assertEqual(player2, "Jan Kowalski")
        self.assertEqual(score, "6:0 6:0")

    def test_tournament_matches_presence(self):
        self.driver.get("http://127.0.0.1:8000/#/turniej/24")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ul/li[3]").click()
        self.driver.find_elements_by_xpath("//h3[contains(text(), '1/8 finału')]")
        self.driver.find_elements_by_xpath("//h3[contains(text(), 'Finał')]")
        self.driver.find_elements_by_xpath("/html/body/div[1]/div/div/div/div[2]/div/div[1]/table/tbody/tr[8]")
        self.driver.find_elements_by_xpath("/html/body/div[1]/div/div/div/div[2]/div/div[4]/table/tbody/tr")

    def test_tournament_participants_presence(self):
        self.driver.get("http://127.0.0.1:8000/#/turniej/24")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/ul/li[4]").click()
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[3]/div/table/tbody/tr")

    def test_tournament_informations(self):
        self.driver.get("http://127.0.0.1:8000/#/turniej/26")
        tournament_name = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[1]/div/table/tbody/tr/td[1]").text
        draw_size = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[1]/div/table/tbody/tr/td[5]").text
        button = self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div/div[1]/div/div/div/a/button").text
        self.assertEqual(tournament_name, "test_tournament")
        self.assertEqual(draw_size, "32")
        self.assertEqual(button, "Zapisz się")

    def test_main_page_tournaments_presence(self):
        self.driver.get(self._url)
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/h3")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div/div[1]/div/div[2]/p")
