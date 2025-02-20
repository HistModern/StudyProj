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
     
    function openModal(){
        modal.style.display = 'block'
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach(el => {
        el.addEventListener('click', () => {
            openModal();
          });
    }
    )

    function closeModal(){
        modal.style.display = 'none'
        document.body.style.overflow = '';
    }
      modalCloseBtn.addEventListener('click', () =>{
        closeModal();
    });

    modal.addEventListener('click' , (e)=>{
       if (e.target === modal){
        closeModal();
       }
    })

     const modalTimerId = setTimeout(openModal , 6000)

    function windowByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', windowByScroll);
        }
    }
    
    window.addEventListener('scroll', windowByScroll)
    
    //use class for cards


    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 42;
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }
    const getResource = async (url) => {
        const res =await fetch(url);

        if(!res.ok ){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json();
        };
    
        getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });
      // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
    
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
        
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

});
