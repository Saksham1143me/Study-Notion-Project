function Spinner ({loading}) {
    return (
    <>
        if(loading){
      <div className="flex bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="spinner">
          <p className="text-3xl text-yellow-200">
          Loading...
          </p>
        </div>
      </div>
        }
        </>
    )
  }
  export default Spinner