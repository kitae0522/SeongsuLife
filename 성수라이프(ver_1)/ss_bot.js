/*
 
    Copyright © 2018 KTIAE, All rights reserved.
    
    #Lincense
    All acts, such as cloning, modification, and distribution are prohibited(Not allowed) without the permission of the copyright holder.
    #저작권
    복제, 수정 및 배포와 같은 모든 행위는 저작권 소유자의 허가 없이 금지됩니다.(허용되지 않음)
*/

/*상수 선언*/
const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
const 공백 = "                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         ";

/*상수 (객체) 선언*/
const spam_Msg = {}; //도배 방지 구현용
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
var sec_admin = "DEBUG$MODE*NAME+"; //부관리자
var name = "성수라이프"; //봇 이름
var set = {}; //건의

/*response 부분*/
function response(room, msg, sender, isGroupChat, replier, imageDB) {

    msg = msg.trim();
    sender = sender.trim();
    room = room.trim();

    /*욕설 감지*/
    var words = ["시발", "씨발", "ㅅㅂ", "ㅆㅂ", "씨바", "시바", "병신", "ㅂㅅ", "븅신", "뵹신", "개새", "새끼", "좆", "또라이", "애미", "니애미", "느금마", "ㄴㅇㅁ", "ㄴㄱㅁ", "씹새", "닥쳐", "ㄷㅊ", "ㅈㄴ"]; //나쁜말
    for (var n = 0; n < words.length; n++) { //반복문
        var words2 = msg.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/gi, ""); //특수문자 감지 
        if (words2.indexOf(words[n]) != -1) { //나쁜말이 대화중에 들어있으면
            replier.reply("[필터링]\n" + sender + "님의 욕이 감지되었습니다.\n감지된 욕:" + "*" + words[n].substr(1)); //감지된 욕설 알림
            break; //반복문 탈출
        }
    }

    /*봇 키는 명령어*/
    if (msg.indexOf("/on") == 0) { //성수라이프 ON
        if (sender == "기태" || sender == "이민규") {
            replier.reply("띠링-☆ 봇이 켜졌어요~😎");
            botOn[room] = true; //성수라이프 (온)/오프 상태
        }
    }

    if (botOn[room] == false) {
        return;
    }

    /*봇 끄는 명령어*/
    if (msg.indexOf("/off") == 0) { //성수라이프 OFF
        if (sender == "기태" || sender == "이민규") {
            replier.reply("띠링-☆ 봇이 꺼졌어요~😂");
            botOn[room] = false; //성수라이프 온/(오프) 상태
        }
    }


    /*도배 방지*/
    if (spam_Msg[room] == msg) return; //동일한 채팅이 두 번 이상 연속으로 수신되면, 가볍게 무시하기
    spam_Msg[room] = msg;

    /*개발자*/
    if (msg.indexOf("/개발자") == 0) {
        replier.reply("개발자 : 기태\n관리자 : 이민규\n\n" +
            "Web Site : kitae0522.dothome.co.kr\n" +
            "Team Web Site : skydata.dothome.co.kr\n" +
            "Copyright ⓒ2018 Sky Data, All rights reserved.");
    }

    /*도움말*/
    if (msg.indexOf("도움말") == 0) {
        replier.reply("봇 이름 : " + name +
            "\n제작자 : " + admin +
            "\n\n 성수중학교의 생활을 좀 더 향상시킬 수 있도록 노력하는 카카오톡 봇입니다." +
            "\n 명령어 목록은 '/명령어'로 확인하실 수 있습니다." +
            "Copyright ⓒ2018 Sky Data, All rights reserved.");
    }

    /*명령어*/
    if (msg.indexOf("/명령어") == 0) {
        replier.reply("[" + name + " 명령어 목록]" + 공백 + "\n\n" +
            "[일반 명령어]\n" +
            "도움말 - " + name + "에 대한 도움말을 띄웁니다.\n" +
            "/명령어 - " + name + "의 명령어 목록을 띄웁니다.\n" +
            "/업데이트 - 업데이트 내역을 알려줍니다.\n" +
            "/개발자 - 개발자에 대해 알려줍니다.\n" +
            "/날씨 - 성수동에 날씨를 알려줍니다.\n" +
            "/번역도움말 - 번역도움말을 띄웁니다.\n\n" +
            "[급식 명령어]\n" +
            "/오늘급식 - 오늘의 급식을 알려줍니다.\n" +
            "/내일급식 - 내일의 급식을 알려줍니다.\n" +
            "/모레급식 - 내일모레의 급식을 알려줍니다.\n\n" +
            "[신청곡 명령어]\n" +
            "/뮤직차트 - 현재 뮤직차트를 10위까지 알려줍니다.\n" +
            "/신청곡 (신청곡 제목) - 점심시간에 노래방송에 (신청곡 제목)을 신청합니다.\n" +
            "/신청곡목록 - 신청곡 목록을 알려줍니다.\n\n" +
            "[관리자 명령어]\n" +
            "/on - 해당 채팅방에서 " + name + "을 활성화시킵니다.\n" +
            "/off - 해당 채팅방에서 " + name + "을 비활성화시킵니다.\n" +
            "/신청곡초기화 - 신청곡 목록을 초기화 시킵니다."
        );
    }

    /*업데이트*/
    if (msg.indexOf("/업데이트") == 0) {
        replier.reply("[" + name + " 업데이트 목록]\n현재 " + name + " 베타버전입니다." + 공백 + "\n\n" +
            "B0.1.~ - 기초 답변 봇을 만들었습니다.\n" +
            "B0.2.0 - 급식정보를 불러오는 코드를 적용시켰습니다.\n" +
            "B0.2.1 - 급식정보를 불러오는데에 문제가 있던 치명적인 버그를 수정했습니다.\n" +
            "B0.2.2 - 날씨정보를 불러오는 코드를 적용시켰습니다.\n" +
            "B0.2.3 - 날씨정보를 불러오는데에 문제가 있던 버그들을 수정했습니다.\n" +
            "B0.3.0 - 번역기 코드를 적용했습니다.\n" +
            "B0.3.1 - 번역기 코드에서 API함수를 적용시켰습니다.\n" +
            "B1.0.0 - 베타버전을 최초로 배포하였습니다.\n" +
            "B1.0.1 - 대기정보를 불러오는 코드를 적용시켰습니다.\n" +
            "B1.1.0 - 문의기능을 추가하였습니다.\n" +
            "B1.2.0 - 코드 오류를 해결했습니다.\n" +
            "B1.2.1 - 명령어 목록을 수정했습니다.\n" +
            "B1.2.2 - 맞춤법을 수정했습니다.\n" +
            "B1.2.3 - 저작권 라이센스를 추가하였습니다.\n" +
            "B1.3.0 - 대기정보를 불러오는 코드를 삭제했습니다.\n" +
            "B1.4.0 - 내일급식을 불러오는 코드를 적용시켰습니다.\n" +
            "B1.4.1 - 내일급식을 불러오는 코드에서 버그를 수정했습니다.\n" +
            "B2.0.0 - 성수봇에서 성수라이프로 이름을 변경했습니다.\n" +
            "B2.0.1 - 모레급식을 불러오는 코드를 적용시켰습니다.\n" +
            "A1.0.0 - 성수라이프가 공식적으로 인증 받았습니다.\n" +
            "A1.1.0 - 신청곡 기능을 추가했습니다.\n" +
            "A1.1.1 - 버그들을 수정했습니다.\n\n" +
            "여러 버그들이나, 여러 명령어들을 적용하고 수집하고 수정하는 단계입니다.\n"
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
        if (sender == "기태" || sender == "이민규") {
            Song.clear();
            replier.reply("신청곡 목록이 초기화되었습니다.");
        }
    }

    /*날씨*/
    try {
        if (msg.indexOf("/날씨") == 0) {
            var u = Utils.getWebText("https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EC%84%B1%EC%88%98%EB%8F%99+%EB%82%A0%EC%94%A8"); //네이버 날씨 크롤링
            var a = u.split("<span class=\"todaytemp\">");
            var b = u.split("<p class=\"cast_txt\">");
            var c = u.split("<span class=\"num\">");
            var d = u.split("<span class=\"ico\">");
            replier.reply(msg.substr(3) + "의 날씨 검색결과 입니다!");
            replier.reply("현재온도 : " + a[1].split("<")[0] + "°C\n현재날씨 : " + b[1].split("<")[0] + "\n최저온도 : " + c[1].split("<")[0] + "°C\n최고온도 : " + c[2].split("<")[0] + "°C\n체감온도 : " + c[3].split("<")[0] + "°C\n자외선 : " + c[4].split("<")[0] + "\n미세먼지 : " + c[5].split("<")[0] + "\n초미세먼지 : " + c[6].split("<")[0]);
        }
    } catch (e) {
        replier.reply("날씨 정보가 없습니다");
    }

    /*오늘 급식*/
    try {
        if (msg.indexOf("/오늘급식") == 0) {
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
        if (msg.indexOf("/내일급식") == 0) {
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
        if (msg.indexOf("/모레급식") == 0) {
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

    /*뮤직차트*/
    if (msg.indexOf("/뮤직차트") != -1) {
        var p = [];
        var u = Utils.getWebText("http://m.music.naver.com/listen/top100.nhn?domain=DOMESTIC&duration=1h")
        var a = u.split("<span class=\"rank\"");
        var o = u.split("<strong class=\"tit\"");
        var d = u.split("<span class=\"stit\"");
        for (var i = 1; i <= 10; i++) {
            p.push("[");
            p.push(a[i].split(">")[1].split("<")[0]);
            p.push("]");
            p.push("(");
            p.push(o[i].split(">")[1].split("<")[0]);
            p.push(")");
            p.push("\"")
            p.push(d[i].split(">")[1].split("<")[0]);
            p.push("\"");
            p.push("\n\n")
        }
        var c = p.join("");
        replier.reply("뮤직차트 1위부터 ~ 10위까지\n\n\n" + c);
    }

    /*번역*/
    if (msg == "/번역도움말") {
        replier.reply("[Tip!] 번역에 오류가 있을 수 있으므로 양해부탁드립니다." + 공백 + "\n\n" +
            "<ke번역 (한국어) :(한국어)를 영어로 번역합니다.\n" +
            "<ek번역 (영어) :(영어)를 한국어로 번역합니다.\n" +
            "<kj번역 (한국어) :(한국어)를 일본어로 번역합니다.\n" +
            "<jk번역 (일본어) :(일본어)를 한국어로 번역합니다.\n" +
            "<kf번역 (한국어) :(한국어)를 프랑스어로 번역합니다.\n" +
            "<fk번역 (프랑스어) :(프랑스어)를 한국어로 번역합니다.\n\n" +
            "번역기 API는 파파고를 이용했습니다.\n"
        );
    }

    if (msg.split(" ")[0] == "/ke번역") {
        replier.reply(Api.babagoTranslate("ko", "en", (msg.substr(6))))
    }
    if (msg.split(" ")[0] == "/kj번역") {
        replier.reply(Api.babagoTranslate("ko", "ja", (msg.substr(6))))
    }
    if (msg.split(" ")[0] == "/ek번역") {
        replier.reply(Api.babagoTranslate("en", "ko", (msg.substr(6))))
    }
    if (msg.split(" ")[0] == "/kf번역") {
        replier.reply(Api.babagoTranslate("ko", "fr", (msg.substr(6))))
    }
    if (msg.split(" ")[0] == "/jk번역") {
        replier.reply(Api.babagoTranslate("ja", "ko", (msg.substr(6))))
    }
    if (msg.split(" ")[0] == "/fk번역") {
        replier.reply(Api.babagoTranslate("fr", "ko", (msg.substr(6))))
    }
}