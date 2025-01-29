window.addEventListener('DOMContentLoaded', ()=>{
    // tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
      tabsContent = document.querySelectorAll('.tabcontent'),
      tabsParent = document.querySelector('.tabheader__items');
    function hideTabContent() {
        tabsContent.forEach( item => {
            item.style.display = "none"; 
        });

        tabs.forEach( item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(item = 0){
        tabsContent[item].style.display = "block";
        tabs[item].classList.add('tabheader__item_active');
    }


    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click' , (event) =>{
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) => {
                if (target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }

    })

    //timer
    const deadline = '2025-04-11'
    
    function getZero(num){
        if (num >= 0 && num < 10){
            return `0${num}`;
        }
        else {
            return num
        }
    }
    function getTimeRemaining(endtime) {
        let days,hours,minutes,seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());
        if (t <= 0){
            days = 0;
              hours = 0;
              minutes = 0;
              seconds = 0;
        }
        else{
              days = Math.floor(t / (1000*60*60*24)),
              hours = Math.floor(t / (1000*60*60) % 24),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);
        }

                return {
                        'total' : t,
                        'days' : days,
                        'hours' : hours,
                        'minutes' : minutes,
                        'seconds' : seconds
                }

    }
   

    function setClock(selector , endtime) {
        const timer = document.querySelector(selector),
                days = timer.querySelector('#days'),
                hours = timer.querySelector('#hours'),
                minutes = timer.querySelector('#minutes'),
                seconds = timer.querySelector('#seconds'),
                timeInterval = setInterval(updateclock, 1000);

        getTimeRemaining(deadline);
        updateclock();       

        function updateclock(){
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0){
                clearInterval(timeInterval);
            }
        }

       
    }

    setClock('.timer', deadline);

     //modal
        
    const modalTrigger = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector('.modal');
    const modalCloseBtn = document.querySelector('[data-close]');
     
    modalTrigger.forEach(el => {
        el.addEventListener('click', () => {
            modal.style.display = 'block'
            document.body.style.overflow = 'hidden';
          });
    }
    )
      modalCloseBtn.addEventListener('click', () =>{
        modal.style.display = 'none'
        document.body.style.overflow = '';
    });


    

});
