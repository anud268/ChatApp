
document.addEventListener('DOMContentLoaded',function(){

const allButtons = document.querySelectorAll('.searchBtn')
const searchBar = document.querySelector('.searchBar')
const searchInput = document.querySelector('#searchInput')
const searchClose = document.querySelector('#searchClose')

for(var i=0; i< allButtons.length;i++){
    allButtons[i].addEventListener('click',function(){
        searchBar.style.visibility = 'visible';
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded','true');
        searchInput.focus();
    })
}

searchClose.addEventListener('click',function(){
    searchBar.style.visibility = 'hidden';
    searchBar.classList.remove('open');
    this.setAttribute('aria-expanded','false');
    searchInput.focus();
})

})



// ===============================================================

var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }

};



// =================================================================================



