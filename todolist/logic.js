// метод получает значение из класса и записывает в переменную
// 
let tipTxt = document.querySelector('.tip'),
    tipBut = document.querySelector('.tipAdd'),
    tip = document.querySelector('#tipLi'),
    taskTxt = document.querySelector('.task'),
    taskBut = document.querySelector('.taskAdd'),
    task = document.querySelector('#taskLi')
;
//let tipTemp = [];
//let taskTemp = [];

//Создаем двумерный массив для целей и задач в виде объекта из двух массивов которые будут содрежать объекты
let data = {
    'tip': [],
    'task': []
};
//проверяем есть ли что то в БД и если есть то заполниема массив data и выводим на экран
if(localStorage.getItem('data')){
    data = JSON.parse(localStorage.getItem('data'));
    output();
}
//метод обработки нажатия кнопки получаем введенное название цели и делаем её активной
tipBut.addEventListener('click', function(){
    let newTip = {
        text: tipTxt.value,
        select: true
    };
    //Записываем новую цель в главный массив
    data.tip.push(newTip);
    output();
    //сохраняем данные в локал сторедж
    localStorage.setItem('data', JSON.stringify(data));
    //очищаем поле воода
    tipTxt.value = '';
});
// тоже самое для задач
taskBut.addEventListener('click', function(){
    let newTask = {
        text: taskTxt.value,
        chec: false
    };
    //console.log(newTask);
    output();
    //сохраняем данные в локал сторедж
    localStorage.setItem('data', JSON.stringify(data));
    //очищаем поле воода
    taskTxt.value = '';
});

//Вывод данных
function output(){
    //вывод задач
    let output = '';
    data.tip.forEach(function(item, i){
        output += `
        <li id='tip_${i}'>
        ${i+1}. ${item.text}
        </li>
        `;
        tip.innerHTML = output;
        console.log(i)
    });
};
