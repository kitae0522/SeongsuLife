/*
 
    Copyright © 2019 KTIAE, All rights reserved.
    
    #Lincense
    All acts, such as cloning, modification, and distribution are prohibited(Not allowed) without the permission of the copyright holder.
    #저작권
    복제, 수정 및 배포와 같은 모든 행위는 저작권 소유자의 허가 없이 금지됩니다.(허용되지 않음)
    
*/

/*상수 선언*/
const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

/*상수 (객체) 선언*/
const botOn = {}; //성수라이프 온/오프 상태
const Song = {}; //신청곡 리스트

/*신청곡 (신청곡 리스트)*/
Song.list = [];
Song.add = function (name) {
    if (Song.isBanned(name)) {
        return false;
    } else {
        Song.list.push(name);
        return true;
    }
};
Song.isBanned = function (name) {
    for (var n = 0; n < Song.list.length; n++) {
        if (Song.list[n] == name) return true;
    }
    return false;
};
Song.getList = function (name) {
    return Song.list;
};
Song.clear = function (name) {
    Song.list = [];
};

/*변수 선언*/
var admin = "기태"; //관리자
var sec_admin = "이민규"; //부관리자
var name = "성수라이프"; //봇 이름

/*response 부분*/
function response(room, msg, sender, isGroupChat, replier, imageDB) {

    msg = msg.trim();
    sender = sender.trim();
    room = room.trim();

    /*봇 키는 명령어*/
    if (msg.indexOf("/on") == 0) { //성수라이프 ON
        if (sender == admin || sender == sec_admin) {
            replier.reply("띠링-☆ 봇이 켜졌어요~😎");
            botOn[room] = true; //성수라이프 (온)/오프 상태
        }
    }

    if (botOn[room] == false) {
        return;
    }

    /*봇 끄는 명령어*/
    if (msg.indexOf("/off") == 0) { //성수라이프 OFF
        if (sender == admin || sender == sec_admin) {
            replier.reply("띠링-☆ 봇이 꺼졌어요~😂");
            botOn[room] = false; //성수라이프 온/(오프) 상태
        }
    }

    /*도움말*/
    if (["도움말", "/도움말"].indexOf(msg) != -1) {
        replier.reply("봇 이름 : " + name +
            "\n제작자 : " + admin +
            "\n\n 성수중학교의 생활을 좀 더 향상시킬 수 있도록 노력하는 카카오톡 봇입니다." +
            "\n 명령어 목록은 '명령어'로 확인하실 수 있습니다." +
            "Copyright ⓒ2019 BlueDot, All rights reserved.");
    }

    /*명령어*/
    if (["명령어", "/명령어"].indexOf(msg) != -1) {
        replier.reply("[" + name + " 명령어 목록]\n\n" +
            "[일반 명령어]\n" +
            "도움말 - " + name + "에 대한 도움말을 띄웁니다.\n" +
            "명령어 - " + name + "의 명령어 목록을 띄웁니다.\n\n" +
            "[급식 명령어]\n" +
            "오늘급식 - 오늘의 급식을 알려줍니다.\n" +
            "내일급식 - 내일의 급식을 알려줍니다.\n" +
            "모레급식 - 내일모레의 급식을 알려줍니다.\n" +
            "글피급식 - 내일모레글피의 급식을 알려줍니다.\n\n" +
            "[신청곡 명령어]\n" +
            "/신청곡 (신청곡 제목) - 점심시간에 노래방송에 (신청곡 제목)을 신청합니다.\n" +
            "/신청곡목록 - 신청곡 목록을 알려줍니다."
        );
    }

    /*신청곡*/
    var cmd = msg.split(" ")[0];
    if (cmd == "/신청곡") {
        let name = msg.replace("/신청곡 ", "");
        Song.add(name);
        replier.reply(name + "라는 곡을 신청하였습니다.");
    } else if (msg == "/신청곡목록") {
        let str = "";
        let list = Song.getList();
        for (let n = 0; n < list.length; n++) {
            str += list[n] + "\n";
        }
        replier.reply("[신청곡 목록]\n" + str.trim());
    } else if (msg == "/신청곡초기화") {
        if (sender == admin || sender == sec_admin) {
            Song.clear();
            replier.reply("신청곡 목록이 초기화되었습니다.");
        }
    }


    /*오늘 급식*/
    try {
        if (["오늘급식", "/오늘급식", "오늘 급식", "/오늘 급식"].indexOf(msg) != -1) {
            var day = new Date();
            var m = (day.getMonth() + 1);
            var d = day.getDate();
            var pap = (m + "월 " + d + "일 [중식]");
            var u = Utils.getWebText("https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EC%84%B1%EC%88%98%EC%A4%91+%EA%B8%89%EC%8B%9D"); //네이버 급식 크롤링
            var a = u.split(pap + "</strong>");
            var b = a[1].split("</ul>");
            b = b[0].replace(/\(\*\)(.+)/g, "").replace(/(<([^>]+)>)/g, "").trim().replace(/  /g, "").replace(/^ +/gm, "")
            replier.reply("급식정보를 읽어오고 있습니다...");
            replier.reply("[성수중학교]\n" + pap + "입니다.\n\n" + b);
        }
    }
    catch (e) {
        replier.reply("학교에서 제공하는 정보가 없거나 식단이 없습니다."); //결과값이 없을시                                      
    }

    /*내일 급식*/
    try {
        if (["내일급식", "/내일급식", "내일 급식", "/내일 급식"].indexOf(msg) != -1) {
            var day = new Date();
            var m = (day.getMonth() + 1);
            var d = (day.getDate() + 1);
            var pap = (m + "월 " + d + "일 [중식]");
            var u = Utils.getWebText("https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EC%84%B1%EC%88%98%EC%A4%91+%EA%B8%89%EC%8B%9D"); //네이버 급식 크롤링
            var a = u.split(pap + "</strong>");
            var b = a[1].split("</ul>");
            b = b[0].replace(/\(\*\)(.+)/g, "").replace(/(<([^>]+)>)/g, "").trim().replace(/  /g, "").replace(/^ +/gm, "")
            replier.reply("급식정보를 읽어오고 있습니다...");
            replier.reply("[성수중학교]\n" + pap + "입니다.\n\n" + b);
        }
    }
    catch (e) {
        replier.reply("학교에서 제공하는 정보가 없거나 식단이 없습니다."); //결과값이 없을시                                       
    }

    /*모레 급식*/
    try {
        if (["모레급식", "/모레급식", "모레 급식", "/모레 급식"].indexOf(msg) != -1) {
            var day = new Date();
            var m = (day.getMonth() + 1);
            var d = (day.getDate() + 2);
            var pap = (m + "월 " + d + "일 [중식]");
            var u = Utils.getWebText("https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EC%84%B1%EC%88%98%EC%A4%91+%EA%B8%89%EC%8B%9D"); //네이버 급식 크롤링
            var a = u.split(pap + "</strong>");
            var b = a[1].split("</ul>");
            b = b[0].replace(/\(\*\)(.+)/g, "").replace(/(<([^>]+)>)/g, "").trim().replace(/  /g, "").replace(/^ +/gm, "")
            replier.reply("급식정보를 읽어오고 있습니다...");
            replier.reply("[성수중학교]\n" + pap + "입니다.\n\n" + b);
        }
    }
    catch (e) {
        replier.reply("학교에서 제공하는 정보가 없거나 식단이 없습니다."); //결과값이 없을시                                     
    }

    /*글피 급식*/
    try {
        if (["글피급식", "/글피급식", "글피 급식", "/글피 급식"].indexOf(msg) != -1) {
            var day = new Date();
            var m = (day.getMonth() + 1);
            var d = (day.getDate() + 3);
            var pap = (m + "월 " + d + "일 [중식]");
            var u = Utils.getWebText("https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EC%84%B1%EC%88%98%EC%A4%91+%EA%B8%89%EC%8B%9D"); //네이버 급식 크롤링
            var a = u.split(pap + "</strong>");
            var b = a[1].split("</ul>");
            b = b[0].replace(/\(\*\)(.+)/g, "").replace(/(<([^>]+)>)/g, "").trim().replace(/  /g, "").replace(/^ +/gm, "")
            replier.reply("급식정보를 읽어오고 있습니다...");
            replier.reply("[성수중학교]\n" + pap + "입니다.\n\n" + b);
        }
    }
    catch (e) {
        replier.reply("학교에서 제공하는 정보가 없거나 식단이 없습니다."); //결과값이 없을시                                     
    }

}