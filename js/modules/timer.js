function timer(){
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

}

export default timer;