// метод получает значение из класса и записывает в переменную
// 
let tipTxt = document.querySelector('.tip'),
    tipBut = document.querySelector('.tipAdd'),
    tip = document.querySelector('.tipLi'),
    taskTxt = document.querySelector('.task'),
    taskBut = document.querySelector('.taskAdd'),
    task = document.querySelector('.taskLi')
;
//let tipTemp = [];
//let taskTemp = [];
//Создаем двумерный массив для целей и задач в виде объекта из двух массивов которые будут содрежать объекты
let data = {
    'tip': [],
    'task': [],
    tipActivIndex: -1
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
        select: false
    };
    //Записываем новую цель в главный массив
    if (tipTxt.value !== '') data.tip.push(newTip);
    output();
    //сохраняем данные в локал сторедж
    localStorage.setItem('data', JSON.stringify(data));
    //очищаем поле воода
    tipTxt.value = '';
});
// тоже самое для задач
taskBut.addEventListener('click', function(){
    if (data.tipActivIndex === -1){
        alert("Для ввода задчи выберите цель")
    } else {
        let newTask = {
            tip: data.tipActivIndex,
            text: taskTxt.value,
            chek: false
        };
        //console.log(newTask);
        if (taskTxt.value !== '') data.task.push(newTask);
        output();
        //сохраняем данные в локал сторедж
        localStorage.setItem('data', JSON.stringify(data));
        //очищаем поле воода
        taskTxt.value = '';
    };
});
//Выбор или удаление активной цели
tip.addEventListener('click', function(event){
    //получаем ID элемента LI
    let tipLi=event.target.getAttribute('id');
    //Проверка на что нажали удалить или выделить
    if (tipLi.search("tip_") !== -1){
        //отбрасываем текстовую часть tip_
        tipLi = tipLi.slice(4);
        //преобразуем в число
        tipLi = Number.parseInt(tipLi);
        //устанавливаем значение false всем целям
        for(let i =0; i < data.tip.length; i++){
            data.tip[i].select = false;
        };
        //устанавливаем значение true выбранной цели
        data.tip[tipLi].select = true;
    } else{
        //отбрасываем текстовую часть tipD_
        tipLi = tipLi.slice(5);
        //преобразуем в число
        tipLi = Number.parseInt(tipLi);
        //Удаляем элемент из массива
        data.tip.splice(tipLi, 1);
        //удаляем связанные задачи
        for (let i = 0; i < data.task.length; i++){
            if (data.task[i].tip === tipLi){
                data.task.splice(i, 1);
                //так как при удалении эдемента массив сдвигается то смещаем и индекс цыкла
                i = i - 1;
            };
        };
    };
    //console.log(tipLi);
    // Выводим на экран, Ура!!! заработало!!!
    output()
    //сохраняем данные в локал сторедж
    localStorage.setItem('data', JSON.stringify(data));
    console.log(JSON.stringify(data));
});
//помечаем или удаляем задачи
task.addEventListener('click', function(event){
    //получаем ID элемента LI
    let taskLi = event.target.getAttribute('id');
    //Проверка на что нажали удалить или пометить
    if (taskLi.search("tas_") !== -1){
        //отбрасываем текстовую часть tas_
        taskLi = taskLi.slice(4);
        //преобразуем в число
        taskLi = Number.parseInt(taskLi);
        //инвертируем статус задачи
        data.task[taskLi].chek = !data.task[taskLi].chek;
    } else {
        //отбрасываем текстовую часть tasD_
        taskLi = taskLi.slice(4);
        //преобразуем в число
        taskLi = Number.parseInt(taskLi);
        //Удаляем элемент из массива
        data.task.splice(taskLi, 1);
    };
    // Выводим на экран
    output()
    //сохраняем данные в локал сторедж
    localStorage.setItem('data', JSON.stringify(data));
    console.log(JSON.stringify(data));
});
//Вывод данных
function output(){
    //вывод задач
    let output = '';
    //если массив целей пуст выводи пустоту
    if (data.tip.length === 0){
        tip.innerHTML = '';
        data.tipActivIndex = -1;
        //сохраняем данные в локал сторедж
        localStorage.setItem('data', JSON.stringify(data));
    };
    //сканируем массив целей и выводим строку li для каждого элемента массива
    data.tip.forEach(function(item, i){
        output += `
        <li id="tip_${i}" ${item.select ? 'class="select"' : ''}>
        <span class="dell" id="tipD_${i}">X</span>${item.text}
        </li>
        `;
        tip.innerHTML = output;
        if (item.select === true){
            data.tipActivIndex = i
            //console.log(data.tipActivIndex)
            //сохраняем данные в локал сторедж
            localStorage.setItem('data', JSON.stringify(data));
        };
        //console.log(i)
    });
    //То же самое для задач, задачи привязаны к целям
    output = '';
    // Проверяем есть ли задачи для выбранной цели. Для этого преобразуем набор элементов tip в простой массив и проверяем
    if (data.task.map(el => el.tip).includes(data.tipActivIndex) === false){
        task.innerHTML = '';
    } else{
        data.task.forEach(function(item, i){
            if (data.tipActivIndex == item.tip){
            output +=`
            <li id="tas_${i}" ${item.chek ? 'class="chek"' : ''}>
            <span class="dell" id="tasD_${i}">X</span>${item.text}
            </li>
            `;
            task.innerHTML = output;
            //console.log(data.tipActivIndex);
            //console.log(item.tip);
            };
        });
    };
};

