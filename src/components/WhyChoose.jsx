import pawPrint from '../Assets/icons/paw-print.svg'
import shieldKeyhole from '../Assets/icons/shield-keyhole.svg'
import houseHeart from '../Assets/icons/house-heart.svg'
import heartHandshake from '../Assets/icons/heart-handshake.svg'

export default function WhyChoose() {
  const features = [
    {
      icon: <img src={pawPrint} alt="Smart Matching Icon" className="w-8 h-8" />,
      title: 'Smart Matching',
      description: 'AI-powered matching to find the perfect pet for you.',
      bgColor: 'bg-[#CEA74E]/20'
    },
    {
      icon: <img src={shieldKeyhole} alt="Verified Providers Icon" className="w-8 h-8" />,
      title: 'Verified Providers',
      description: 'All providers are verified to ensure safety and trust.',
      bgColor: 'bg-[#CACACA]/20'
    },
    {
      icon: <img src={houseHeart} alt="Easy Adoption Icon" className="w-8 h-8" />,
      title: 'Easy Adoption',
      description: 'Simple steps from discovery to adoption.',
      bgColor: 'bg-[#CEA74E]/20'
    },
    {
      icon: <img src={heartHandshake} alt="Ongoing Support Icon" className="w-8 h-8" />,
      title: 'Ongoing Support',
      description: 'We are here to support you every step of the way.',
      bgColor: 'bg-[#CACACA]/20'
    }
  ]

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
          Why Choose Furpect Match?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="space-y-4">
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center text-3xl`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-black">{feature.title}</h3>
              <p className="text-black leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
