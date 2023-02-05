import axios from 'axios'


export async function getServerSideProps({params}){
    try{
    const res = await axios.get(`${HOST}articles/${params.slug}/`)
    const data = await res.data
    return {
      props: {data:data}, // will be passed to the page component as props
    }
  }
  catch(e){
    console.log("here")
    console.log(e)
  
    return {
      props:{}
    }
  }
  }


export default function Component({data}){
  if(data){
    return(
        <div>
            {data.title}
            {data.description}
        </div>
    )
  }

  return(
    <div>NOT FOUND</div>
  )
}

