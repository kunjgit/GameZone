let heat_beat = new Audio("./assets/heartbeat.mp3")

// Function executing on click
const calculate = () => {

    let male_name = document.querySelector("#mname").value
    let female_name = document.querySelector("#fname").value
    
    if (male_name.length!==0 && female_name.length!==0){
    let love_score = 0
    result = document.querySelector(".result")
    result.style.display = "none"


    male_name.replace(/\s/g, "")
    female_name.replace(/\s/g, "")
    let combined_name = (male_name + female_name).toLowerCase()
    for (let i = 0; i < combined_name.length; i++) {
        if (combined_name[i] === "l" || combined_name[i] === "o" || combined_name[i] === "v" || combined_name[i] === "e"|| combined_name[i] === "t"|| combined_name[i] === "r"|| combined_name[i] === "u") {
            love_score++
        }
    }
    let love_percent = Math.floor((love_score / combined_name.length) * 100)

    let love_remark = ""
    if (love_percent < 10 || love_percent > 90)
        love_remark = "You go together like coke and mentos"
    else if (love_percent >= 40 && love_percent <= 50)
        love_remark = "You are alright together"
    else if (love_percent >= 10 && love_percent < 40)
        love_remark = "Not best compatible"
    else
        love_remark = "You go well together"

    heat_beat.play()

    heart = document.querySelector(".lds-heart")
    heart.style.visibility = "visible"

    const result_function = () => {
        heart.style.visibility = "hidden"
        result = document.querySelector(".result")
        result.innerHTML = `Your love score is ${love_percent}💓${love_remark}`
        result.style.display = "block"
    }

    setTimeout(result_function, 5000)
    }
    
    else{
        alert("Name can't be empty")
    }
}