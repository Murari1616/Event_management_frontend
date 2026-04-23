import { CircleCheckBig } from 'lucide-react'
import { phoneNumber } from '@/appConstants'
import background from '../../assets/images/SuccessBackground.png';
const RentSuccess = () => {
    return (
        <div className='w-full h-full bg-white rounded-lg flex lg:flex-row md:flex-row flex-col justify-center items-center lg:bg-contain md:bg-contain bg-cover bg-center lg:px-20 md:px-20 px-6'
        style={{
                backgroundImage: `url(${background})`,
              }}>
            <CircleCheckBig color='lightgreen' size={120} className='lg:hidden md:hidden'/>
            <CircleCheckBig color='lightgreen' size={240} className='lg:block md:block hidden'/>
            <p className='font-bold text-4xl text-center'>Thank You!</p>
            <div className='flex flex-col items-center'>
                <p className="lg:text-lg md:text-lg text-sm px-4 py-2 rounded-md shadow-sm leading-relaxed space-y-2">
                    <span className="block mb-2">
                        You’ll get a confirmation call within 10 minutes. If you don’t hear from us, please call.
                    </span>
                    <span className="block">
                        మీరు 10 నిమిషాల్లోగా ధృవీకరణ కాల్‌ను పొందుతారు. కాల్ రాకపోతే, దయచేసి కాల్ చేయండి
                    </span>
                </p>
                <p className='text-2xl'>📞 {phoneNumber}</p>
            </div>
        </div>
    )
}

export default RentSuccess
