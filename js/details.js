 let game=JSON.parse(localStorage.getItem('details'));
 console.log(game);

const container_details =document.querySelector('#container_details');

console.log(container_details)
 container_details.innerHTML=`
       <div class='w-[80%] lg:w-[60%] '>
          <div class=' h-80 flex justify-center mb-4 lg:h-[400px]  py-4 rounded-lg'>

          <img id='img_dtl' src='${game.img}' class="rounded-3xl shadow-[0px_0px_42px] shadow-slate-800  "/>
              
          </div>
          <h2 class='text-xl sm:text-2xl md:text-4xl font-bold  text-gray-300'>${game.name}</h2>
          <div  ">
              <p id='dev_description' class='description text-gray-400  '>
                  ${game.description}
              </p>
          </div>
          <div>
              <p class="text-gray-100 cursor-pointer" onclick="readMor(this)">Read more...</p>
         </div>
         <div class="sm:flex sm:justify-between text-gray-200 pt-4 ">
             <div class="flex justify-between sm:block">
                   <p class="sm:text-lg font-bold">reddit</p>
                   <p class="text-gray-400 min-w-[60px] "><a class="hover:text-[#9006ac9d]" href='${game.reddit}'>click link</a></p>
             </div>
             <div class="flex justify-between sm:block">
                   <p class="sm:text-lg font-bold min-w-[120px]">Release Date</p>
                   <p class="text-gray-400">${game.released}</p>
             </div>
             <div class="flex justify-between sm:block">
                   <p class="sm:text-lg font-bold min-w-[110px]">update Date</p>
                   <p class="text-gray-400">${game.update}</p>
             </div>
         </div>
         <div class="py-8">
                <p class="text-gray-200">⨂ ${game.rating}<spam class="text-gray-400">/5.00</spam></p>
         </div>
         <div class='pb-12  flex gap-5'>
               ${game.platforms}
         </div>
         <div class="flex justify-center">
            <button class=" flex justify-center gap-4 p-1 items-center border w-[70%] rounded-full text-gray-400 hover:border-[#9006ac58] hover:text-[#9c2fb2a9]"> <p>Add to Favorites</p> <i   data-like="noLiked" class="fa-regular fa-heart  "></i></button>
         </div>
    </div>
 `


 function readMor(elm){
     if(elm.textContent=='Read more...'){
         elm.textContent='Read Less';
        
         document.querySelector('#dev_description').classList.remove('description');
         document.querySelector('#dev_description').classList.add('descriptionX');


     }else{
         elm.textContent='Read more...';
         document.querySelector('#dev_description').classList.remove('descriptionX');
         document.querySelector('#dev_description').classList.add('description');
     }
      
 }

 
//sidebar----------------------

 const sidebarBtn = document.getElementById('sidebar-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebar-close');

  //katban 
  sidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('hidden');
    setTimeout(() => {
      sidebar.classList.remove('translate-x-64'); 
    }, 10);
  });

  // kat7ayad
  sidebarClose.addEventListener('click', () => {
    sidebar.classList.add('translate-x-64'); 
    setTimeout(() => {
      sidebar.classList.add('hidden');
    }, 300); 
  });