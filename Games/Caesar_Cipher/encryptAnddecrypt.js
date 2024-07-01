// Current Year
let year=new Date().getFullYear()
document.body.querySelector(".footer").innerText=`Copyright ©️ ${year}`

// Encrypt and Decrypt
const letters=alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
    't', 'u', 'v', 'w', 'x', 'y', 'z'
  ]

const isLetter=(str)=>{
  return (/[a-z]/).test(str)
}

const encrypt_function=()=>{
  document.querySelector(".encrypt-msg").style.visibility="hidden"

  let message=document.querySelector(".msg").value
  let shift=document.querySelector(".shift").value
  message=message.toLowerCase()
  shift=shift%26
  let encrypt_message=""
  for (let i=0;i<message.length;i++){
    let index=alphabet.indexOf(message[i])

    if (isLetter(message[i])){
      encrypt_message+=alphabet[index+shift]
    }
    else{
      encrypt_message+=message[i]
    }
  }
  document.querySelector(".encrypt-msg").style.visibility="visible"
  document.querySelector(".encrypt-msg").innerText=encrypt_message
}

const decrypt_function=()=>{
  document.querySelector(".decrypt-msg").style.visibility="hidden"

  let message=document.querySelector(".msg").value
  let shift=document.querySelector(".shift").value
  message=message.toLowerCase()
  shift=shift%26
  let decrypt_message=""
  for (let i=0;i<message.length;i++){
    let index=alphabet.lastIndexOf(message[i])

    if (isLetter(message[i])){
      decrypt_message+=alphabet[index-shift]
    }
    else{
      decrypt_message+=message[i]
    }
  }
  document.querySelector(".decrypt-msg").style.visibility="visible"
  document.querySelector(".decrypt-msg").innerText=decrypt_message
}