
let localData=JSON.parse(localStorage.getItem('likes'));
//icons platforms
let iconsPlat =[  {'type':'PC','data':'<i class="text-[13px] text-gray-400 fa-brands fa-windows"></i>'}
                 ,{'type':'PlayStation','data':'<i class="text-[13px] text-gray-400 fa-brands fa-playstation"></i>'}
                 ,{'type':'Xbox','data':'<i class="text-[13px] text-gray-400 fa-brands fa-xbox"></i>'}
                 ,{'type':'Linux','data':'<i class="text-[13px] text-gray-400 fa-brands fa-linux"></i>'}
                 ,{'type':'Nintendo','data':'<i class="text-[13px] text-gray-400 fa-solid fa-gamepad"></i>'}
               ];

const  fav_continer =document.querySelector("#fav_continer");
fav_continer.classList='grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-3 xl:lg:grid-cols-4   gap-4 xl:gap-[14px] md:px-16 xl:px-16 '

localData.forEach(elm=>{
             const card =document.createElement('div');
              card.className='max-w-[87%] flex flex-col  rounded-[16px] shadow-md hover:scale-[1.05] transition-transform border border-gray-600  p-5 hover:shadow-[0px_0px_12px_rgba(151,173,172,0.210)] sm:max-w-[431px]  md:max-w-[341px] lg:max-w-[281px] justify-self-center';

              //platforms games
               let div_pltf='';
               let elementsPlatforms=elm.platforms.split(',');
                elementsPlatforms.forEach(plat=>{
                      iconsPlat.forEach(icon=>{
                           if(icon.type==plat){
                                
                                div_pltf+=icon.data;
                           }
                           
                      })
                })
                

             card.innerHTML = `<div class="flex justify-between h-12" >
                                    <div id='plat_catr' class='flex gap-2'>${div_pltf}</div>
                                     <span class='text-end pb-4'>
                                      <i onclick="removeFavorites('${elm.id}')" class="text-[#9006ac9d]  hover:text-gray-400  fa-solid fa-heart"></i>
                                     </span>
                                </div>

                             <a href="./details.html"> <div class="w-full h-40">
                               <img src="${elm.img}" alt="${elm.name}" class="w-full h-full object-cover rounded  min-w-[280px] max-w-[280px] sm:min-w-[340px] md:min-w-[300px] lg:min-w-[240px]">
                             </div>

                            <div class="p-3">
                                  <h3 class="text-sm  sm:text-[18px] font-semibold text-white truncate">${elm.name}</h3>
                        
                                  <div class="mt-[8px] flex items-center justify-between text-xs text-gray-500">
                                    <span> ⨂ ${elm.rating }</span>
                                  </div>
                                   <div class="mt-[18px] flex items-center justify-between text-xs text-gray-500">
                                        <span class="text-gray-300">updated : </span> 
                                        <span>${elm.updated }</span>
                                    </div>
                            </div> 
                            </a>`;
                fav_continer.appendChild(card);

                 //bach njib li platform , 7it kitamhaw f div_pltf='';
                let platforms_dtls=div_pltf;

                card.addEventListener('click',()=>{
                    getDetails(`${elm.id}`,`${elm.img}`,`${elm.name}`,`${elm.description}`,`${elm.reddit_url}`,`${platforms_dtls}`,`${elm.released}`,`${elm.rating}`,`${elm.updated}`)
                }) ;
})


function removeFavorites(id){
              localData=localData.filter(like=>like.id!=id);
              localStorage.setItem('likes',JSON.stringify(localData));
              window.location.reload();
}

//add details :---------------------------

function getDetails(id,img,name,description,reddit,platforms,released,rating,update){
          localStorage.setItem('details',JSON.stringify({id:id,img:img,name:name,description:description,reddit:reddit,
platforms:platforms,released:released,rating:rating,update:update}))
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