// @ts-nocheck
import NoFound from '../assets/images/NoFound.png'
import { Button } from './ui/button'

const NotFound=() => {
  return (
    <div className='flex justify-center items-center w-full h-full'>
      <div className='flex flex-col justify-center items-center'>
        <div>
          {/* <img src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" alt="" /> */}
          <img className='w-1/2 mix-blend-multiply m-auto' src={NoFound} alt="" />
        </div>
        <Button variant={"link"} onClick={() => window.history.back()} size={"default"} className=''>
          <small className='text-primary cursor-pointer underline'>Go to Previous Page</small>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
