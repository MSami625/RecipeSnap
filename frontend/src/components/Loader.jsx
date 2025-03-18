import Skeleton from "react-skeleton-loading";

const MyLoader = () => (
  <div>
  
    <div className="bg-gray-300 p-4 h-20">
     
    </div>


    <div className="mt-10 font-poppins flex flex-col md:flex-row gap-16 px-12 md:px-10">
      {/* Main Content Section */}
      <div className="md:w-4/5 w-full">
        
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4">
            <Skeleton width={150  } height={30} />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} width="240px" height="140px" />
            ))}
          </div>
        </section>

       
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">
            <Skeleton width="60%" height={30} />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} width="240px" height="140px" />
            ))}
          </div>
        </section>
      </div>

     
      <div className="md:w-1/4 mt-6 w-full">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
         
          <h2 className="text-xl font-bold mb-4">
            <Skeleton width="100%" height={30} />
          </h2>
          <Skeleton width="100%" height={40} className="mb-4" />
          
         
          <Skeleton width="100%" height={40} className="mb-4" />
          
       
          <Skeleton width="100%" height={40} className="mb-4" />

   
          <Skeleton width="100%" height={40} className="mb-4" />

         
          <Skeleton width="100%" height={40} />
        </div>
      </div>
    </div>
  </div>
);

export default MyLoader;
