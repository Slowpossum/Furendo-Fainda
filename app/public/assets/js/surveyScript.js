$("#surveySubmit").on("click", function (e) {
    var surveyData = {
        name: "",
        photo: "",
        scores: []
    }

    if ($("#nameInput").val() && $("#photoInput").val()) {
        if (!$(".error:eq(0)").hasClass("hide")) {
            $(".error:eq(0)").toggleClass("hide");
        }
        if (!$(".error:eq(1)").hasClass("hide")) {
            $(".error:eq(1)").toggleClass("hide");
        }

        surveyData.name = $("#nameInput").val();
        surveyData.photo = $("#photoInput").val();
    } else {
        if (!$("#nameInput").val() && $(".error:eq(0)").hasClass("hide")) {
            $(".error:eq(0)").toggleClass("hide");
        } else if ($("#nameInput").val()) {
            if (!$(".error:eq(0)").hasClass("hide")) {
                $(".error:eq(0)").toggleClass("hide");
            }
        }

        if (!$("photoInput").val() && $(".error:eq(1)").hasClass("hide")) {
            $(".error:eq(1)").toggleClass("hide");
        } else if ($("#photoInput").val()) {
            if (!$(".error:eq(1)").hasClass("hide")) {
                $(".error:eq(1)").toggleClass("hide");
            }
        }
    }

    surveyData = evaluateScores(surveyData);

    if (surveyData.name && surveyData.photo && surveyData.scores.length === $(".custom-select").length) {
        $.ajax({
            method: 'GET',
            url: '/api/friends'
        }).then(function (data) {
            if (data.length > 0) {
                var bestFriend = evaluateFriendship(data, surveyData);

                var bestFriendData = $("<p>").text(`Your best friend is ${bestFriend.name} with a difference of ${bestFriend.diff}!`);
                $("#infoModal .modal-body p").replaceWith(bestFriendData);
                $("#infoModal").modal(focus);
                // resetAll();
            } else {
                $("#infoModal .modal-body p").replaceWith("<p>No users to compare results with.</p>");
                $("#infoModal").modal(focus);
            }

            $.ajax({
                method: 'POST',
                url: 'api/friends',
                data: surveyData
            }).then(function (data) {
                console.log(data);
                console.log("User added to user list.");
            });
        });
    }
});

function evaluateScores(surveyData) {
    var questions = $(".custom-select");

    for (var i = 0; i < questions.length; i++) {

        if (questions[i].selectedIndex === 0) {
            if ($(`.error:eq(${i + 2})`).hasClass("hide")) {
                $(`.error:eq(${i + 2})`).toggleClass("hide");
            }
        } else {
            if (!$(`.error:eq(${i + 2})`).hasClass("hide")) {
                $(`.error:eq(${i + 2})`).toggleClass("hide");
            }

            surveyData.scores.push(questions[i].selectedIndex);
        }
    }

    return surveyData;
}

function evaluateFriendship(friends, surveyData) {
    var currBestFriend = [{
        name: "",
        diff: 1000
    }];

    for (user of friends) {
        var diff = 0;

        for (question in user.scores) {
            diff += Math.abs(user.scores[question] - surveyData.scores[question]);
        }

        if (diff < currBestFriend.diff) {
            currBestFriend.name = user.name;
            currBestFriend.diff = diff;
        } else if (diff === currBestFriend.diff) {
            //asdfasgkjashdflawsjdhf
        }
    }

    return currBestFriend;
}

function resetAll() {

}