
    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      return array;
    }

    var arr = [1, 2, 3, 4, 5, 6, 7, 8, null];
    shuffle(arr);
    console.log(arr);

    document.getElementById("x1").innerHTML = arr[0];
    document.getElementById("x2").innerHTML = arr[1];
    document.getElementById("x3").innerHTML = arr[2];
    document.getElementById("x4").innerHTML = arr[3];
    document.getElementById("x5").innerHTML = arr[4];
    document.getElementById("x6").innerHTML = arr[5];
    document.getElementById("x7").innerHTML = arr[6];
    document.getElementById("x8").innerHTML = arr[7];
    document.getElementById("x9").innerHTML = arr[8];

    var y1 = document.getElementById("x1").innerText;
    var y2 = document.getElementById("x2").innerText;
    var y3 = document.getElementById("x3").innerText;
    var y4 = document.getElementById("x4").innerText;
    var y5 = document.getElementById("x5").innerText;
    var y6 = document.getElementById("x6").innerText;
    var y7 = document.getElementById("x7").innerText;
    var y8 = document.getElementById("x8").innerText;
    var y9 = document.getElementById("x9").innerText;

    function xyz1() {
      if (y2 == "") {
        [y1, y2] = [y2, y1];
        document.getElementById("x1").innerText = y1;
        document.getElementById("x2").innerText = y2;
        console.log(y1, y2);
      }
      if (y4 == "") {
        [y1, y4] = [y4, y1];
        document.getElementById("x1").innerText = y1;
        document.getElementById("x4").innerText = y4;
        console.log(y1, y4);
      }
    }

    function xyz2() {
      if (y1 == "") {
        [y1, y2] = [y2, y1];
        document.getElementById("x1").innerText = y1;
        document.getElementById("x2").innerText = y2;
        console.log(y1, y2);
      }
      if (y3 == "") {
        [y2, y3] = [y3, y2];
        document.getElementById("x2").innerText = y2;
        document.getElementById("x3").innerText = y3;
        console.log(y1, y4);
      }
      if (y5 == "") {
        [y2, y5] = [y5, y2];
        document.getElementById("x2").innerText = y2;
        document.getElementById("x5").innerText = y5;
      }
    }

    function xyz3() {
      if (y2 == "") {
        [y3, y2] = [y2, y3];
        document.getElementById("x3").innerText = y3;
        document.getElementById("x2").innerText = y2;
      }
      if (y6 == "") {
        [y3, y6] = [y6, y3];
        document.getElementById("x3").innerText = y3;
        document.getElementById("x6").innerText = y6;
      }
    }

    function xyz4() {
      if (y1 == "") {
        [y1, y4] = [y4, y1];
        document.getElementById("x1").innerText = y1;
        document.getElementById("x4").innerText = y4;
        console.log(y1, y2);
      }
      if (y5 == "") {
        [y5, y4] = [y4, y5];
        document.getElementById("x5").innerText = y5;
        document.getElementById("x4").innerText = y4;
      }
      if (y7 == "") {
        [y7, y4] = [y4, y7];
        document.getElementById("x7").innerText = y7;
        document.getElementById("x4").innerText = y4;
      }
    }

    function xyz5() {
      if (y2 == "") {
        [y5, y2] = [y2, y5];
        document.getElementById("x5").innerText = y5;
        document.getElementById("x2").innerText = y2;
      }
      if (y4 == "") {
        [y5, y4] = [y4, y5];
        document.getElementById("x5").innerText = y5;
        document.getElementById("x4").innerText = y4;
      }
      if (y6 == "") {
        [y5, y6] = [y6, y5];
        document.getElementById("x5").innerText = y5;
        document.getElementById("x6").innerText = y6;
      }
      if (y8 == "") {
        [y5, y8] = [y8, y5];
        document.getElementById("x5").innerText = y5;
        document.getElementById("x8").innerText = y8;
      }
    }

    function xyz6() {
      if (y3 == "") {
        [y6, y3] = [y3, y6];
        document.getElementById("x3").innerText = y3;
        document.getElementById("x6").innerText = y6;
      }
      if (y5 == "") {
        [y6, y5] = [y5, y6];
        document.getElementById("x5").innerText = y5;
        document.getElementById("x6").innerText = y6;
      }
      if (y9 == "") {
        [y6, y9] = [y9, y6];
        document.getElementById("x9").innerText = y9;
        document.getElementById("x6").innerText = y6;
      }
    }

    function xyz7() {
      if (y4 == "") {
        [y7, y4] = [y4, y7];
        document.getElementById("x4").innerText = y4;
        document.getElementById("x7").innerText = y7;
      }
      if (y8 == "") {
        [y7, y8] = [y8, y7];
        document.getElementById("x8").innerText = y8;
        document.getElementById("x7").innerText = y7;
      }
    }

    function xyz8() {
      if (y7 == "") {
        [y8, y7] = [y7, y8];
        document.getElementById("x7").innerText = y7;
        document.getElementById("x8").innerText = y8;
      }
      if (y5 == "") {
        [y8, y5] = [y5, y8];
        document.getElementById("x5").innerText = y5;
        document.getElementById("x8").innerText = y8;
      }
      if (y9 == "") {
        [y8, y9] = [y9, y8];
        document.getElementById("x9").innerText = y9;
        document.getElementById("x8").innerText = y8;
      }
    }

    function xyz9() {
      if (y8 == "") {
        [y8, y9] = [y9, y8];
        document.getElementById("x8").innerText = y8;
        document.getElementById("x9").innerText = y9;
      }
      if (y6 == "") {
        [y6, y9] = [y9, y6];
        document.getElementById("x6").innerText = y6;
        document.getElementById("x9").innerText = y9;
      }
    }
    if (
      x1 == "1" &&
      x2 == "2" &&
      x3 == "3" &&
      x4 == "4" &&
      x5 == "5" &&
      x6 == "6" &&
      x7 == "7" &&
      x8 == "8" &&
      x9 == ""
    ) {
      alert("Congrats You Win");
    }
