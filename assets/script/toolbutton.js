const tools = document.querySelectorAll(".tools ul li a")
//console.log(tools)
tools.forEach(tool => {
    tool.addEventListener("click", function(event) {
        event.preventDefault();
        //console.log("(placeholder)")
    })
})