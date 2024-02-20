(function(){
    //Cube.initSolver();
    scramblers['333'].initialize(null, Math);
    Cube.initSolver();
    var cube = new RubiksCube();
    var moveLog = "";
    var currentScramble = "";
    var duringSolve = false;
    var movecountArr = [];
    var timerready = false;
    function doAlg(algorithm){
        logMove(algorithm);
        cube.doAlgorithm(algorithm);
        drawCube(cube.cubestate);
        if(duringSolve&&cube.isSolved()){
            if (movecountArr.length !=0){
                document.getElementById("movecountList").innerHTML+= ", ";
            }
            var movecountlink = "<a href=\"" + getACNurl(moveLog, currentScramble) + "\" target=\"_blank\">" + countMoves(moveLog) + "</a>";
            document.getElementById("movecountList").innerHTML+= movecountlink;
            duringSolve = false;
            movecountArr.push(countMoves(moveLog));
            var sum = 0;
            movecountArr.forEach(function(item, index, array) {
                sum+=item;
            });	
            document.getElementById("movecountavg").innerHTML = sum/movecountArr.length + " stm mean of " + movecountArr.length;

        }
        if (timerready&&!cube.isSolved()){
            startTimer();
            timerready = false;
        }
        if (cube.isSolved()){

            var time = stopTimer();
            var moves = countMoves(moveLog); 
            var composite = time + moves;
            console.log("Snyder Challenge = " + time + " + " + moves + " = " + composite);
        }
    }



    function logMove(algorithm){
        moveLog +=algorithm;
        moveLog = alg.cube.simplify(moveLog);
        document.getElementById("movesTextArea").value = moveLog;
        //document.getElementById("acn").href = ("https://alg.cubing.net/?setup="+document.getElementById("scrambleTextArea").value +"&alg=" + moveLog).replace(/\n/g, "%0A");
        document.getElementById("acn").href = ("https://alg.cubing.net/?setup=" + currentScramble +"&alg=" + moveLog).replace(/\n/g, "%0A");
        document.getElementById("JonatanCFOP").href = ("https://jonatanklosko.github.io/reconstructions/#/show?scramble=" + currentScramble +"&solution=" + moveLog + "&method=cfop").replace(/\n/g, "");
        document.getElementById("JonatanRoux").href = ("https://jonatanklosko.github.io/reconstructions/#/show?scramble=" + currentScramble +"&solution=" + moveLog + "&method=roux").replace(/\n/g, "");
        document.getElementById("JonatanZZ").href = ("https://jonatanklosko.github.io/reconstructions/#/show?scramble=" + currentScramble +"&solution=" + moveLog + "&method=ZZ").replace(/\n/g, "");
        document.getElementById("moveCounter").innerHTML = countMoves(moveLog) + "";

    }

    function getACNurl(solution, scramble){
        //return ("https://alg.cubing.net/?setup=" + scramble +"&alg=" + solution).replace(/\n/g, "%0A");
        return "https://alg.cubing.net/?setup=" + encodeURIComponent(scramble) +"&alg=" + encodeURIComponent(solution);
    }
    function countMoves(algorithm){
        /*var noRot = algorithm.replace(/[xyz]\d*'?/g, "");
        if(noRot.trim() == ""){
            return 0;
        }
        else return noRot.trim().split(/(?=[A-Za-z])/).length;*/
        return alg.cube.countMoves(algorithm,  {metric: "btm"})
    }
    function obfusticate(algorithm){
        var rc = new RubiksCube();
        rc.doAlgorithm(algorithm);
        orient = alg.cube.invert(rc.wcaOrient());
        return (alg.cube.invert(rc.solution()) + orient).replace(/2'/g, "2");
    }

    function fixAlgorithm(algorithm){
        return algorithm.replace(/\[|\]|\)|\(/g, "");
        //TODO Allow commutators

    }

    function randomStateScramble(){
        var randomCube = Cube.random();
        scramble = randomCube.solve();
        this.doAlgorithm(randomCube.solve());
        return scramble;
    }
    function resetAll(){
        cube.resetCube();
        drawCube(cube.cubestate);
        document.getElementById("movesTextArea").value = "";
        moveLog = "";
        document.getElementById("moveCounter").innerHTML = "0";
    }

    function generatePreScramble(raw_alg, generator, times, obfusticateAlg){

        var genArray = generator.split(",");

        var scramble = "";
        var i = 0;

        for (; i<times; i++){
            var rand = Math.floor(Math.random()*genArray.length);
            scramble += genArray[rand];
        }
        scramble += alg.cube.invert(raw_alg);

        if (obfusticateAlg){
            return obfusticate(scramble);
        }
        else {
            return scramble;
        }
    }
    function obfusticate(algorithm){

        //Cube.initSolver();
        var rc = new RubiksCube();
        rc.doAlgorithm(algorithm);
        orient = alg.cube.invert(rc.wcaOrient());
        return (alg.cube.invert(rc.solution()) + " " + orient).replace(/2'/g, "2");
    }


    function getScramble(scrambleType){
        switch(scrambleType){
            case "normal":
                return scramblers["333"].getRandomScramble();
                break;
            case "Edge":
                return scramblers["333"].getEdgeScramble();
                break;
            case "Corner":
                return scramblers["333"].getCornerScramble();
                break;
            case "LL":
                return scramblers["333"].getLLScramble();
                break;
            case "CMLL":
                return scramblers["333"].getCMLLScramble();
                break;
            case "LSLL":
                return scramblers["333"].getLSLLScramble();
                break;
            case "ZBLL":
                return scramblers["333"].getZBLLScramble();
                break;
            case "2GLL":
                return scramblers["333"].get2GLLScramble();
                break;
            case "PLL":
                return scramblers["333"].getPLLScramble();
                break;
            case "ZZLS":
                return scramblers["333"].getZZLSScramble();
                break;
            case "Cross2":
                return scramblers["333"].getNonWhiteYellowCrossScramble();
                break;
            case "Cross":
                return scramblers["333"].getCrossScramble();
                break;
            
            case "42":
                return generatePreScramble("", "M'UM, M'U'M, MUM', MU'M',M2, RUMU'R'M,R U R' U R U2' R' ,R U R' U' R' F R2 U' R' U' R U R' F' ,R U' R' ,R U' R' U2 R U' R' ,R' U' R U' R' U2 R,R U2' R' U R U R' ", 10000, true);
                break;
            case "zipperls":
                return generatePreScramble("", "U,RUR'URU2'R',RUR'U'R'FR2U'R'U'RUR'F',FRU'R'U'RUR'F'RUR'U'R'FRF',R'F'RURU'R'F,R'FRF'UF'U2'FU'RUR',FRUR'U'F',RUR'U'R'FRF',RU2'R'URU2'R'UF'U'F,FRF'LFR'F'L'", 10000, true);
                break;

        }
    }

    var starttime;
    function startTimer(){
        starttime = new Date().getTime();
    }

    function stopTimer(){
        if (starttime == null){
            return;
        }
        return ((new Date().getTime() - starttime)/1000);
    }

    var listener = new window.keypress.Listener();
    window.listener = listener;
    /*listener.register_combo({
        "keys"              : "i",
        "on_keydown"        : function() {	doAlg("R");},
        "is_solitary"      : true,
    });
    listener.register_combo({
        "keys"              : "shift i",
        "on_keydown"        : function() {	doAlg("M");}    
    });*/

    var keymaps = [

        ["i", "R"], 
        ["k" , "R'"],
        ["j" , "U"],
        ["f" , "U'"],
        ["h" , "F"],
        ["g" , "F'"],
        ["w" , "B"],
        ["o" , "B'"],
        ["d" , "L"],
        ["e" , "L'"],
        ["s" , "D"],
        ["l" , "D'"],
        ["u" , "r"],
        ["m" , "r'"],
        ["v" , "l"],
        ["r" , "l'"],
        ["`" , "M"],
        ["'" , "M"],
        ["[" , "M'"],
        ["t" , "x"],
        ["n" , "x'"],
        [";" , "y"],
        ["a" , "y'"],
        ["shift j", "E' U'"],
        ["shift f", "E U"],
        ["shift h", "S F'"],
        ["shift g", "S' F"],
        ["shift l", "E' D"],
        ["shift s", "E D'"],
        ["x", "E"],
        [".", "E'"]];


    keymaps.forEach(function(keymap){
        listener.register_combo({
            "keys"              : keymap[0],
            "on_keydown"        : function() {	doAlg(keymap[1]);},     
        });
    });


    listener.simple_combo("1", function() {	
        moveLog = "";
        document.getElementById("movesTextArea").value = "";
        document.getElementById("moveCounter").innerHTML = "0";
    });
    //listener.simple_combo("ctrl v", function() {	});
    listener.simple_combo("p", function() {	doAlg("z");});

    listener.simple_combo("q", function() {	doAlg("z'");});
    listener.simple_combo("backspace", function() {	
        doAlg(document.getElementById("scrambleTextArea").value);
        document.getElementById("movesTextArea").value = "";
        document.getElementById("moveCounter").innerHTML = "0";
        currentScramble = document.getElementById("scrambleTextArea").value;
        moveLog = "";
    });
    listener.simple_combo("esc", function() {
        resetAll();

    });

    listener.simple_combo("space", function() {
        //cube.randomScramble();


        //scramble = scramblers["333"].getLSLLScramble();//.scramble_string
        scramble = getScramble(document.getElementById("scrambletype").value);
        cube.resetCube();
        cube.doAlgorithm(scramble);
        moveLog = "";
        document.getElementById("movesTextArea").value = ""
        drawCube(cube.cubestate);
        document.getElementById("moveCounter").innerHTML = "0";
        currentScramble = scramble;
        duringSolve = true;
        timerready = true;
    });
    listener.simple_combo("enter", function() {
        moveLog += "\n";
        document.getElementById("movesTextArea").value = moveLog;
    });


    //DRAWING THE CUBE

    var canvas = document.getElementById("cube");
    var ctx = canvas.getContext("2d");
    var stickerSize = 50;

    function fillSticker(x, y, colour) {
        ctx.fillStyle = colour;
        ctx.fillRect(stickerSize * x, stickerSize * y, stickerSize, stickerSize);
    }

    function randomOrientation(colourNeutrality){
        var parts = colourNeutrality.split("+");
        if(parts[1]!=""){
            doAlg(parts[1]);
        }

    }
    function fillWithIndex(x, y, face, index, cubeArray) {
        index--;
        switch (face) {
            case "u":
                break;
            case "r":
                index += 9;
                break;
            case "f":
                index += 18;
                break;
            case "d":
                index += 27;
                break;
            case "l":
                index += 36;
                break;
            case "b":
                index += 45;
                break;
        }

        var sticker = cubeArray[index];
        var colour;
        switch (sticker) {
            case 1:
                colour = "white";
                break;
            case 2:
                colour = "red";
                break;
            case 3:
                colour = "green";
                break;
            case 4:
                colour = "yellow";
                break;
            case 5:
                colour = "orange";
                break;
            case 6:
                colour = "blue";
                break;
        }
        fillSticker(x, y, colour);
    }
    function drawCube(cubeArray) {
        fillWithIndex(0, 0, "l", 1, cubeArray);
        fillWithIndex(1, 0, "u", 1, cubeArray);
        fillWithIndex(2, 0, "u", 2, cubeArray);
        fillWithIndex(3, 0, "u", 3, cubeArray);
        fillWithIndex(4, 0, "r", 3, cubeArray);


        fillWithIndex(0, 1, "l", 2, cubeArray);
        fillWithIndex(1, 1, "u", 4, cubeArray);
        fillWithIndex(2, 1, "u", 5, cubeArray);
        fillWithIndex(3, 1, "u", 6, cubeArray);
        fillWithIndex(4, 1, "r", 2, cubeArray);


        fillWithIndex(0, 2, "l", 3, cubeArray);
        fillWithIndex(1, 2, "u", 7, cubeArray);
        fillWithIndex(2, 2, "u", 8, cubeArray);
        fillWithIndex(3, 2, "u", 9, cubeArray);
        fillWithIndex(4, 2, "r", 1, cubeArray);


        fillWithIndex(0, 3, "l", 3, cubeArray);
        fillWithIndex(1, 3, "f", 1, cubeArray);
        fillWithIndex(2, 3, "f", 2, cubeArray);
        fillWithIndex(3, 3, "f", 3, cubeArray);
        fillWithIndex(4, 3, "r", 1, cubeArray);


        fillWithIndex(0, 4, "l", 6, cubeArray);
        fillWithIndex(1, 4, "f", 4, cubeArray);
        fillWithIndex(2, 4, "f", 5, cubeArray);
        fillWithIndex(3, 4, "f", 6, cubeArray);
        fillWithIndex(4, 4, "r", 4, cubeArray);


        fillWithIndex(0, 5, "l", 9, cubeArray);
        fillWithIndex(1, 5, "f", 7, cubeArray);
        fillWithIndex(2, 5, "f", 8, cubeArray);
        fillWithIndex(3, 5, "f", 9, cubeArray);
        fillWithIndex(4, 5, "r", 7, cubeArray);
    }
    drawCube(cube.cubestate);



    //CUBE OBJECT
    function RubiksCube() {


        this.cubestate = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6];

        this.resetCube = function(){
            this.cubestate = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6];
        }
        this.solution = function(){
            var gcube = Cube.fromString(this.toString());
            return gcube.solve();
        }
        this.isSolved = function(){
            for (var i = 0; i<6;i++){
                colour1 = this.cubestate[9*i];
                for (var j = 0; j<8; j++){
                    if (this.cubestate[9*i + j + 1]!=colour1){
                        return false;
                    }
                }
            }
            return true;
        }
        this.randomScramble = function(){

            var i;
            for(i = 0; i<100;i++){
                rand = Math.floor((Math.random() * 18));

                moves = ["U","R","F","D","L","B", "U'","R'","F'","D'","L'","B'", "U2","R2","F2","D2","L2","B2"];

                this.doAlgorithm(moves[rand]);

            }
        }
        this.isSolved = function(){
            var i;
            var cs = this.cubestate;
            for(i = 0; i<46;i = i+9){
                var firstSticker = cs[i];
                var k;
                for(k = i;k<i+9;k++){
                    if(firstSticker!=cs[k]){
                        return false;
                    }
                }	

            }
            return true;
        }

        this.wcaOrient = function() {
            // u-r--f--d--l--b
            // 4 13 22 31 40 49
            //
            var moves = "";

            if (this.cubestate[13]==1) {//R face
                this.doAlgorithm("z'");
                moves +="z'";
            } else if (this.cubestate[22]==1) {//on F face
                this.doAlgorithm("x");
                moves+="x";
            } else if (this.cubestate[31]==1) {//on D face
                this.doAlgorithm("x2");
                moves+="x2";
            } else if (this.cubestate[40]==1) {//on L face
                this.doAlgorithm("z");
                moves+="z";
            } else if (this.cubestate[49]==1) {//on B face
                this.doAlgorithm("x'");
                moves+="x'";
            }

            if (this.cubestate[13]==3) {//R face
                this.doAlgorithm("y");
                moves+="y";
            } else if (this.cubestate[40]==3) {//on L face
                this.doAlgorithm("y'");
                moves+="y'";
            } else if (this.cubestate[49]==3) {//on B face
                this.doAlgorithm("y2");
                moves+="y2";
            }

            return moves;
        }
        this.toString = function(){
            var str = "";
            var i;
            var sides = ["U","R","F","D","L","B"]
            for(i=0;i<this.cubestate.length;i++){
                str+=sides[this.cubestate[i]-1];
            }
            return str;

        }


        this.test = function(alg){
            this.doAlgorithm(alg);
            drawCube(this.cubestate);
        }

        this.doAlgorithm = function(alg) {
            var moveArr = alg.split(/(?=[A-Za-z])/);
            var i;

            for (i = 0;i<moveArr.length;i++) {
                var move = moveArr[i];
                var myRegexp = /([RUFBLDrufbldxyzEMS])(\d*)('?)/g;
                var match = myRegexp.exec(move.trim());


                if (match!=null) {

                    var side = match[1];

                    var times = 1;
                    if (!match[2]=="") {
                        times = match[2] % 4;
                    }

                    if (match[3]=="'") {
                        times = (4 - times) % 4;
                    }

                    switch (side) {
                        case "R":
                            this.doR(times);
                            break;
                        case "U":
                            this.doU(times);
                            break;
                        case "F":
                            this.doF(times);
                            break;
                        case "B":
                            this.doB(times);
                            break;
                        case "L":
                            this.doL(times);
                            break;
                        case "D":
                            this.doD(times);
                            break;
                        case "r":
                            this.doRw(times);
                            break;
                        case "u":
                            this.doUw(times);
                            break;
                        case "f":
                            this.doFw(times);
                            break;
                        case "b":
                            this.doBw(times);
                            break;
                        case "l":
                            this.doLw(times);
                            break;
                        case "d":
                            this.doDw(times);
                            break;
                        case "x":
                            this.doX(times);
                            break;
                        case "y":
                            this.doY(times);
                            break;
                        case "z":
                            this.doZ(times);
                            break;
                        case "E":
                            this.doE(times);
                            break;
                        case "M":
                            this.doM(times);
                            break;
                        case "S":
                            this.doS(times);
                            break;

                    }
                } else {

                    console.log("Invalid alg");

                }

            }

        }

        this.solveNoRotate = function(){
            //Center sticker indexes: 4, 13, 22, 31, 40, 49
            cubestate = this.cubestate;
            this.cubestate = [cubestate[4],cubestate[4],cubestate[4],cubestate[4],cubestate[4],cubestate[4],cubestate[4],cubestate[4],cubestate[4],
                              cubestate[13],cubestate[13],cubestate[13],cubestate[13],cubestate[13],cubestate[13],cubestate[13],cubestate[13],cubestate[13],
                              cubestate[22],cubestate[22],cubestate[22],cubestate[22],cubestate[22],cubestate[22],cubestate[22],cubestate[22],cubestate[22],
                              cubestate[31],cubestate[31],cubestate[31],cubestate[31],cubestate[31],cubestate[31],cubestate[31],cubestate[31],cubestate[31],
                              cubestate[40],cubestate[40],cubestate[40],cubestate[40],cubestate[40],cubestate[40],cubestate[40],cubestate[40],cubestate[40],
                              cubestate[49],cubestate[49],cubestate[49],cubestate[49],cubestate[49],cubestate[49],cubestate[49],cubestate[49],cubestate[49]];
        }

        this.doU = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.cubestate = [cubestate[6], cubestate[3], cubestate[0], cubestate[7], cubestate[4], cubestate[1], cubestate[8], cubestate[5], cubestate[2], cubestate[45], cubestate[46], cubestate[47], cubestate[12], cubestate[13], cubestate[14], cubestate[15], cubestate[16], cubestate[17], cubestate[9], cubestate[10], cubestate[11], cubestate[21], cubestate[22], cubestate[23], cubestate[24], cubestate[25], cubestate[26], cubestate[27], cubestate[28], cubestate[29], cubestate[30], cubestate[31], cubestate[32], cubestate[33], cubestate[34], cubestate[35], cubestate[18], cubestate[19], cubestate[20], cubestate[39], cubestate[40], cubestate[41], cubestate[42], cubestate[43], cubestate[44], cubestate[36], cubestate[37], cubestate[38], cubestate[48], cubestate[49], cubestate[50], cubestate[51], cubestate[52], cubestate[53]];
            }

        }

        this.doR = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;

                this.cubestate = [cubestate[0], cubestate[1], cubestate[20], cubestate[3], cubestate[4], cubestate[23], cubestate[6], cubestate[7], cubestate[26], cubestate[15], cubestate[12], cubestate[9], cubestate[16], cubestate[13], cubestate[10], cubestate[17], cubestate[14], cubestate[11], cubestate[18], cubestate[19], cubestate[29], cubestate[21], cubestate[22], cubestate[32], cubestate[24], cubestate[25], cubestate[35], cubestate[27], cubestate[28], cubestate[51], cubestate[30], cubestate[31], cubestate[48], cubestate[33], cubestate[34], cubestate[45], cubestate[36], cubestate[37], cubestate[38], cubestate[39], cubestate[40], cubestate[41], cubestate[42], cubestate[43], cubestate[44], cubestate[8], cubestate[46], cubestate[47], cubestate[5], cubestate[49], cubestate[50], cubestate[2], cubestate[52], cubestate[53]]
            }

        }

        this.doF = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.cubestate = [cubestate[0], cubestate[1], cubestate[2], cubestate[3], cubestate[4], cubestate[5], cubestate[44], cubestate[41], cubestate[38], cubestate[6], cubestate[10], cubestate[11], cubestate[7], cubestate[13], cubestate[14], cubestate[8], cubestate[16], cubestate[17], cubestate[24], cubestate[21], cubestate[18], cubestate[25], cubestate[22], cubestate[19], cubestate[26], cubestate[23], cubestate[20], cubestate[15], cubestate[12], cubestate[9], cubestate[30], cubestate[31], cubestate[32], cubestate[33], cubestate[34], cubestate[35], cubestate[36], cubestate[37], cubestate[27], cubestate[39], cubestate[40], cubestate[28], cubestate[42], cubestate[43], cubestate[29], cubestate[45], cubestate[46], cubestate[47], cubestate[48], cubestate[49], cubestate[50], cubestate[51], cubestate[52], cubestate[53]];
            }

        }

        this.doD = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.cubestate = [cubestate[0], cubestate[1], cubestate[2], cubestate[3], cubestate[4], cubestate[5], cubestate[6], cubestate[7], cubestate[8], cubestate[9], cubestate[10], cubestate[11], cubestate[12], cubestate[13], cubestate[14], cubestate[24], cubestate[25], cubestate[26], cubestate[18], cubestate[19], cubestate[20], cubestate[21], cubestate[22], cubestate[23], cubestate[42], cubestate[43], cubestate[44], cubestate[33], cubestate[30], cubestate[27], cubestate[34], cubestate[31], cubestate[28], cubestate[35], cubestate[32], cubestate[29], cubestate[36], cubestate[37], cubestate[38], cubestate[39], cubestate[40], cubestate[41], cubestate[51], cubestate[52], cubestate[53], cubestate[45], cubestate[46], cubestate[47], cubestate[48], cubestate[49], cubestate[50], cubestate[15], cubestate[16], cubestate[17]];
            }

        }

        this.doL = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.cubestate = [cubestate[53], cubestate[1], cubestate[2], cubestate[50], cubestate[4], cubestate[5], cubestate[47], cubestate[7], cubestate[8], cubestate[9], cubestate[10], cubestate[11], cubestate[12], cubestate[13], cubestate[14], cubestate[15], cubestate[16], cubestate[17], cubestate[0], cubestate[19], cubestate[20], cubestate[3], cubestate[22], cubestate[23], cubestate[6], cubestate[25], cubestate[26], cubestate[18], cubestate[28], cubestate[29], cubestate[21], cubestate[31], cubestate[32], cubestate[24], cubestate[34], cubestate[35], cubestate[42], cubestate[39], cubestate[36], cubestate[43], cubestate[40], cubestate[37], cubestate[44], cubestate[41], cubestate[38], cubestate[45], cubestate[46], cubestate[33], cubestate[48], cubestate[49], cubestate[30], cubestate[51], cubestate[52], cubestate[27]];
            }

        }

        this.doB = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.cubestate = [cubestate[11], cubestate[14], cubestate[17], cubestate[3], cubestate[4], cubestate[5], cubestate[6], cubestate[7], cubestate[8], cubestate[9], cubestate[10], cubestate[35], cubestate[12], cubestate[13], cubestate[34], cubestate[15], cubestate[16], cubestate[33], cubestate[18], cubestate[19], cubestate[20], cubestate[21], cubestate[22], cubestate[23], cubestate[24], cubestate[25], cubestate[26], cubestate[27], cubestate[28], cubestate[29], cubestate[30], cubestate[31], cubestate[32], cubestate[36], cubestate[39], cubestate[42], cubestate[2], cubestate[37], cubestate[38], cubestate[1], cubestate[40], cubestate[41], cubestate[0], cubestate[43], cubestate[44], cubestate[51], cubestate[48], cubestate[45], cubestate[52], cubestate[49], cubestate[46], cubestate[53], cubestate[50], cubestate[47]];
            }

        }

        this.doE = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.cubestate = [cubestate[0], cubestate[1], cubestate[2], cubestate[3], cubestate[4], cubestate[5], cubestate[6], cubestate[7], cubestate[8], cubestate[9], cubestate[10], cubestate[11], cubestate[21], cubestate[22], cubestate[23], cubestate[15], cubestate[16], cubestate[17], cubestate[18], cubestate[19], cubestate[20], cubestate[39], cubestate[40], cubestate[41], cubestate[24], cubestate[25], cubestate[26], cubestate[27], cubestate[28], cubestate[29], cubestate[30], cubestate[31], cubestate[32], cubestate[33], cubestate[34], cubestate[35], cubestate[36], cubestate[37], cubestate[38], cubestate[48], cubestate[49], cubestate[50], cubestate[42], cubestate[43], cubestate[44], cubestate[45], cubestate[46], cubestate[47], cubestate[12], cubestate[13], cubestate[14], cubestate[51], cubestate[52], cubestate[53]];
            }

        }

        this.doM = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.cubestate = [cubestate[0], cubestate[52], cubestate[2], cubestate[3], cubestate[49], cubestate[5], cubestate[6], cubestate[46], cubestate[8], cubestate[9], cubestate[10], cubestate[11], cubestate[12], cubestate[13], cubestate[14], cubestate[15], cubestate[16], cubestate[17], cubestate[18], cubestate[1], cubestate[20], cubestate[21], cubestate[4], cubestate[23], cubestate[24], cubestate[7], cubestate[26], cubestate[27], cubestate[19], cubestate[29], cubestate[30], cubestate[22], cubestate[32], cubestate[33], cubestate[25], cubestate[35], cubestate[36], cubestate[37], cubestate[38], cubestate[39], cubestate[40], cubestate[41], cubestate[42], cubestate[43], cubestate[44], cubestate[45], cubestate[34], cubestate[47], cubestate[48], cubestate[31], cubestate[50], cubestate[51], cubestate[28], cubestate[53]];
            }

        }

        this.doS = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.cubestate = [cubestate[0], cubestate[1], cubestate[2], cubestate[43], cubestate[40], cubestate[37], cubestate[6], cubestate[7], cubestate[8], cubestate[9], cubestate[3], cubestate[11], cubestate[12], cubestate[4], cubestate[14], cubestate[15], cubestate[5], cubestate[17], cubestate[18], cubestate[19], cubestate[20], cubestate[21], cubestate[22], cubestate[23], cubestate[24], cubestate[25], cubestate[26], cubestate[27], cubestate[28], cubestate[29], cubestate[16], cubestate[13], cubestate[10], cubestate[33], cubestate[34], cubestate[35], cubestate[36], cubestate[30], cubestate[38], cubestate[39], cubestate[31], cubestate[41], cubestate[42], cubestate[32], cubestate[44], cubestate[45], cubestate[46], cubestate[47], cubestate[48], cubestate[49], cubestate[50], cubestate[51], cubestate[52], cubestate[53]];
            }

        }

        this.doX = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.doR(1);
                this.doM(3);
                this.doL(3);
            }
        }

        this.doY = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;

                this.doU(1);
                this.doE(3);
                this.doD(3);
            }
        }

        this.doZ = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;

                this.doF(1);
                this.doS(1);
                this.doB(3);
            }
        }

        this.doUw = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.doE(3);
                this.doU(1);

            }

        }

        this.doRw = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.doM(3);
                this.doR(1);
            }

        }

        this.doFw = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.doS(1);
                this.doF(1);
            }

        }

        this.doDw = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.doE(1);
                this.doD(1);
            }

        }

        this.doLw = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.doM(1);
                this.doL(1);
            }

        }

        this.doBw = function(times) {
            var i;
            for (i = 0; i < times; i++) {
                cubestate = this.cubestate;
                this.doS(3);
                this.doB(1);
            }

        }
    }
})();

function getRecons(){

    copyToClipboard(document.getElementById("movecountList").innerHTML);
}

function copyToClipboard(txt) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", txt);
}