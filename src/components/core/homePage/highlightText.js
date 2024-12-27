// import { LinearGradient } from 'react-text-gradients'
function HighlightText ({text}) {
  return (
    <div className="font-bold inline">
      <span className='bg-clip-text text-transparent inl rounded-lg bg-gradient-to-r from-[#17acff] to-[#ff68f0]'>
        {/* <LinearGradient gradient={['to right', '#17acff ,#ff68f0']}> */}
        {" "+text}
        </span>
  {/* </LinearGradient></span> */}
    </div>
  )
}
export default HighlightText