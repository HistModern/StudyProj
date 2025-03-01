function openModal(modalSelector, modalTimerId){
    const modal = document.querySelector(modalSelector);
    modal.style.display = 'block'
    document.body.style.overflow = 'hidden';
    console.log(modalTimerId)
    if(modalTimerId){
    clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector){
    const modal = document.querySelector(modalSelector);
    modal.style.display = 'none'
    document.body.style.overflow = '';
}

function modal(trigerModal, modalSelector, modalTimerId){
    const modalTrigger = document.querySelectorAll(trigerModal);
    const modal = document.querySelector(modalSelector);
    const modalCloseBtn = document.querySelector('[data-close]');
     
    modalTrigger.forEach(el => {
        el.addEventListener('click', () => {
            openModal(modalSelector, modalTimerId);
          });
    }
    )
      modalCloseBtn.addEventListener('click', () =>{
        closeModal(modalSelector);
    });

    modal.addEventListener('click' , (e)=>{
       if (e.target === modal){
        closeModal(modalSelector);
       }
    })



    function windowByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', windowByScroll);
        }
    }
    
    window.addEventListener('scroll', windowByScroll)
    
}

export default modal;
export{openModal};
export{closeModal};