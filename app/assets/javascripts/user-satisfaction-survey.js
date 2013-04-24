var GOVUK = GOVUK || {};
GOVUK.UserSatisfaction = GOVUK.UserSatisfaction || function () {};

GOVUK.UserSatisfaction.prototype = (function() {
  var cookieNameTakenSurvey = "govuk_takenUserSatisfactionSurvey";

  return {
    cookieNameTakenSurvey: cookieNameTakenSurvey,
    setCookieTakenSurvey: function () {
      setCookie(cookieNameTakenSurvey, true, 30*4);

      var survey = document.getElementById("user-satisfaction-survey");
      survey.style.display = "none";
    },
    appendCurrentPathToSurveyUrl: function() {
      var takeSurvey = document.getElementById('take-survey');
      var surveyUrlWithPath = takeSurvey.getAttribute('href') + "?c=" + window.location.pathname;
      takeSurvey.setAttribute('href', surveyUrlWithPath);
    },
    setEventHandlers: function () {
      var noThanks = $("#survey-no-thanks");
      var takeSurvey = $("#take-survey");

      noThanks.click(this.setCookieTakenSurvey);
      takeSurvey.click(this.setCookieTakenSurvey);
      takeSurvey.click(this.appendCurrentPathToSurveyUrl);
    },
    showSurveyBar: function () {
      if (getCookie(cookieNameTakenSurvey) === "true") {
        return;
      }
      this.setEventHandlers();

      var survey = document.getElementById("user-satisfaction-survey");
      var isMobileUA = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile|Opera\ Mini)/);
      var isMobileScreen = screen.availWidth < 900;

      if (survey && !this.otherNotificationVisible() && !isMobileUA && !isMobileScreen) {
        survey.style.display = "block";
      }
    },
    otherNotificationVisible: function() {
      return $('#banner-notification:visible, #global-cookie-message:visible, #global-browser-prompt:visible').length > 0;
    },
    randomlyShowSurveyBar: function () {
      var min = 0;
      var max = 100;
      var random = Math.floor(Math.random() * (max - min + 1)) + min;

      if (random === 0 || random === 100 || random % 15 === 0) {
        this.showSurveyBar();
      }
    }
  };
})();
