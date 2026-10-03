import { useEffect, useRef } from 'react'

const Lesson11_6_1IntersectionObserver = () => {


  const divRef1 = useRef<HTMLDivElement | null>(null)


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("fetched");
        }
      })
    });

    if (divRef1.current) {
      observer.observe(divRef1.current);
    }

    return () => observer.disconnect();
  }, [])

  return (
    <div style={{ height: '200vh', paddingTop: '100vh' }}>
      <div ref={divRef1} className='sc1 my-100' style={{ background: 'lightblue', padding: '20px' }}>
        Scroll down to me!
      </div>
      <div className='sc2 my-100' style={{ background: 'lightblue', padding: '20px' }}>
        Scroll down to me!
      </div>
      <div className='sc3 my-100' style={{ background: 'lightblue', padding: '20px' }}>
        Scroll down to me!
      </div>
      <div className='sc4 my-100' style={{ background: 'lightblue', padding: '20px' }}>
        Scroll down to me!
      </div>

    </div>
  )
}

export default Lesson11_6_1IntersectionObserver