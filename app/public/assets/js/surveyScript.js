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
            $("#infoModal .modal-body").empty();

            if (data.length > 0) {
                var bestFriend = evaluateFriendship(data, surveyData);
                
                if (bestFriend.length === 1) {
                    var bestFriendData = $("<p>").text(`Your best friend is ${bestFriend[0].name} with a difference of ${bestFriend[0].diff} points!`);
                    $("#infoModal .modal-body").append(bestFriendData);
                    $("#infoModal").modal(focus);
                } else {
                    var bestFriendData = $("<p>").text("You have more than one best friend!");
                    var bestFriendList = $("<ul>");
                    for (friend of bestFriend) {
                        var currFriend = $("<li>").text(friend.name);
                        bestFriendList.append(currFriend);
                    }
                    var closer = $("<p>").text(`All with a difference of ${bestFriend[0].diff} points!`);

                    $("#infoModal .modal-body").append(bestFriendData, bestFriendList, closer);
                    $("#infoModal").modal(focus);
                }
                
                resetAll();
            } else {
                $("#infoModal .modal-body").append("<p>No users to compare results with.</p>");
                $("#infoModal").modal(focus);
            }

            $.ajax({
                method: 'POST',
                url: 'api/friends',
                data: surveyData
            }).then(function (data) {
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
        console.log("tick");
        var currDiff = 0;

        for (question in user.scores) {
            currDiff += Math.abs(user.scores[question] - surveyData.scores[question]);
        }

        if (currDiff < currBestFriend[0].diff) {
            currBestFriend = [{
                name: user.name,
                diff: currDiff
            }];
        } else if (currDiff === currBestFriend[0].diff) {
            var addFriend = {
                name: user.name,
                diff: currDiff
            };
            currBestFriend.push(addFriend);
        }
    }

    return currBestFriend;
}

function resetAll() {

}