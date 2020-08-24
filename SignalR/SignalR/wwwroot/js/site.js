// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
connection.start();

$(function () {


    $(".vote-submit").css({ "pointer-events": "none", "opacity": "0.6" });


    let activeRadio;
    $(document).on("change", ".vote-input", function (event) {

        activeRadio = this;


        if ($(this).is(':checked')) {
            $(".vote-submit").css({ "pointer-events": "auto", "opacity": "1" });
        }
    })

    $(document).on("click", ".vote-submit", function (event) {

        $(activeRadio).parent().addClass("bg-success");
        $(activeRadio).siblings().addClass("text-white");

        $(".progress").removeClass("d-none");

        event.preventDefault();

        $(".vote-input").css("display", "none");

        $(this).css({ "pointer-events": "none", "opacity": "0.6" });

        var groupName = $(activeRadio).siblings().text().trim();
        connection.invoke("SendVote", groupName).catch(function (err) {
            return console.error(err.toString());
        });
    })


    connection.on("ReceiveVote", function (votes) {
        var allVoteCount = 0;

        for (var i = 0; i < votes.length; i++) {
            allVoteCount += votes[i].value;
        }

        $(votes).each(function (index, element) {

            let groupName = element.key;
            let voteCount = element.value;
            let votePercent = parseInt(voteCount * 100 / allVoteCount);
            
            `${$(`.${groupName}`).css({ "width": `${votePercent}%` }).text(`${votePercent} %`)}`;
        });
    });
});