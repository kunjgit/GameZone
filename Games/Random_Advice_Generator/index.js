const id=document.querySelector("#num");
const but=document.querySelector('.dice');
const content=document.querySelector('.content');
const getData=async()=>{
  // id.innerHTML=Number(id.innerHTML)+1;
  id.innerHTML=Math.floor(Math.random()*211)+1
  console.log( id.innerHTML);
  const res =await fetch(`https://api.adviceslip.com/advice/${id.innerHTML}`);
  const data=await res.json();
  // content.innerHTML=data.slip.advice;
  content.innerHTML=`"${data.slip.advice}"`;
}
but.addEventListener('click',()=>{
  getData();
})