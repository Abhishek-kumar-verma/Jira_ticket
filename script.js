var uid = new ShortUniqueId();
console.log(uid());
let Editable =false;
let isEditable =false;
let deleteMode =false;
let colors = ["pink","blue","green","black"];
let defaultColor ="black";
let input=document.querySelector(".input_container_text");

//console.log(input.value);
let main = document.querySelector(".main-container");

let lock = document.querySelector(".lock");
let unlock = document.querySelector(".unlock");
let plus = document.querySelector(".add");
let crossElement = document.querySelector(".cross");
let modal = document.querySelector(".modal");
let colorChooser = document.querySelector(".color_group");
let colorContainer = document.querySelector(".color-container");
let allcolorList = document.querySelectorAll(".color_picker");

input.addEventListener("keydown",function (e){
    if(e.code=="Enter" && input.value){
        console.log("task Value", input.value);
        let id=uid();
        modal.style.display = "none";
        createTask(id,input.value,true,defaultColor);
        

        input.value="";
    }
})

//
lock.addEventListener("click",function(){
    let numberOfElements=document.querySelectorAll(".task_main >div")
    //console.log(numberOfElements.length);
    for(let i=0;i<numberOfElements.length;i++){

        numberOfElements[i].contentEditable=false;
    }
    lock.classList.add("active");
    unlock.classList.remove("active");

})
unlock.addEventListener("click", function (e) {
    let  numberOFElements = document.querySelectorAll(".task_main>div")
      for (let i = 0; i < numberOFElements.length; i++) {
          numberOFElements[i].contentEditable = true;
      }
      lock.classList.remove("active");
      unlock.classList.add("active");
  })
crossElement.addEventListener("click",function(){
    deleteMode = !deleteMode;
    if(deleteMode){
        crossElement.classList.add("active");
    }
    else{
        crossElement.classList.remove("active");
    }

})
plus.addEventListener("click",function(){
    modal.style.display="flex";
})
  
function createTask(id,task,flag,color){
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class","task_container");
    main.appendChild(taskContainer);
    taskContainer.innerHTML=`<div class="task_header
    ${color ? color:defaultColor}"></div>
    <div class="task_main">
        <h3 class="task_id">#${id}</h3>
        <div class="task_name" contentEditable="true">${task}</div>
    </div>`;
    // *************** color change concept*********
    let taskHeader = taskContainer.querySelector(".task_header");
    taskHeader.addEventListener("click", function(){
        //console.log(taskHeader.classList)// get all class on element by classlist;
        let cColor = taskHeader.classList[1];
        //console.log(cColor);
        let idx = colors.indexOf(cColor);
        let nextIdx=(idx+1)%4;
        console.log(nextIdx);
        let nextColor = colors[nextIdx];
        console.log(nextColor);
        taskHeader.classList.remove(cColor);
        taskHeader.classList.add(nextColor);
        // color change in local storage
        let idForNextColor = taskHeader.parentNode.children[1].children[0];
        idForNextColor = idForNextColor.textContent;
        idForNextColor=idForNextColor.split("#")[1];
        let taskArr = JSON.parse(localStorage.getItem("tasks"));
        //console.log("hello");
        for(let i=0;i<taskArr.length;i++){
            if(taskArr[i] !=null){
                if(taskArr[i].id==idForNextColor){
                    taskArr[i].ccolor=nextColor;
                    break;
                }

            }
 
        }
        console.log(taskArr);
        //after some change in local storage you should set item in local storage
        localStorage.setItem("tasks", JSON.stringify(taskArr));

    })
    // task name editing in ui and reflect in local storage
    let inputTask = document.querySelector(".task_main>div");
    //console.log(inputTask);
    inputTask.addEventListener("blur",function(){
        let content = inputTask.textContent;
        console.log(content);
        let idForEdit = taskHeader.parentNode.children[1].children[0];
        idForEdit = idForEdit.textContent;
        idForEdit=idForEdit.split("#")[1];
        let taskArr = JSON.parse(localStorage.getItem("tasks"));
        for(let i=0;i<taskArr.length;i++){
            if(taskArr[i].id==idForEdit){
                taskArr[i].task=content;  
                break;
            }
        }
        //after some change in local storage you should set item in local storage
        localStorage.setItem("tasks", JSON.stringify(taskArr));
    })
    // *************** delete *************;
    taskContainer.addEventListener("click",function(){
        if(deleteMode==true){
            // for ui delete
            taskContainer.remove();
            // also delete from local storage
            let idForDelete = taskHeader.parentNode.children[1].children[0];
            idForDelete = idForDelete.textContent;
            idForDelete=idForDelete.split("#")[1];
            let taskArr = JSON.parse(localStorage.getItem("tasks"));
            for(let i=0;i<taskArr.length;i++){
                if(taskArr[i]!=null){
                    if(taskArr[i].id==idForDelete){
                        //console.log(taskArr[i])
                        delete taskArr[i];  
                        break;
                    }

                }

            }
            //after some change in local storage you should set item in local storage
            localStorage.setItem("tasks", JSON.stringify(taskArr));
        }
        
    })
    if(flag==true){
        let taskString = localStorage.getItem("tasks");
        let taskArr = JSON.parse(taskString) || [];
        let taskObject={
           id:id,
           task:task,
          ccolor:color
    }
    taskArr.push(taskObject);
    // new task add in local storage;
    localStorage.setItem("tasks",JSON.stringify(taskArr));

    }
    defaultColor = "black";
    //modal.style.display="none";
    
    


    
}
//  ********* for showing task in  ui after reload 

//*********** for filtering by color wise; */
// let colorBtns = document.querySelectorAll(".color");
// for(let i=0;i<colorBtns.length;i++){
//     colorBtns[i].addEventListener("click",function(){
//         let filteredColor = colorBtns[i].classList[1];
//         console.log(filteredColor);
//         filterCards(filteredColor);
//     })
// }
colorContainer.addEventListener("click", function (e) {
    let element = e.target;
    console.log("e.target", element);
    if (element != colorContainer) {
        let filteredCardColor = element.classList[1];
        filterCards(filteredCardColor);
    }
})
// for modal color selector;

colorChooser.addEventListener( "click",function(e){
    let element = e.target;
    console.log(element);
    if(element != colorContainer){
        let filteredColor = element.classList[1];
        // for border change in modal
        defaultColor = filteredColor;
        for(let i=0;i<allcolorList.length;i++){
            // remove all except removing that particular
            allcolorList[i].classList.remove("selected");
        }
        //add border
        element.classList.add("selected");

    }
})
function filterCards(filteredColor){
    let allTaskCards = document.querySelectorAll(".task_container");
    for(let i=0;i<allTaskCards.length;i++){
        let taskHeader = allTaskCards[i].querySelector(".task_header");
        //console.log(taskHeader.classList);


        let taskColor = taskHeader.classList[1];
        console.log(taskColor);
        if(taskColor==filteredColor){
            // show 
            allTaskCards[i].style.display = "block";
        }
        else{
            // make not visible
            allTaskCards[i].style.display = "none";

        }
    }
}
(function (){
    let TaskArr = JSON.parse(localStorage.getItem("tasks"));
    for(let i=0;i<TaskArr.length;i++){
        if(TaskArr[i] !=null){
            let {id,task,ccolor} = TaskArr[i];
            createTask(id,task,false,ccolor);

        }
    }
    modal.style.display="none";
})();