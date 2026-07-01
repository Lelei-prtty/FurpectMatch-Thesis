export default function WhyChoose() {
  const features = [
    {
      icon: '✨',
      title: 'Smart Matching',
      description: 'AI-powered matching to find the perfect pet for you.',
      bgColor: 'bg-purple-100'
    },
    {
      icon: '🛡️',
      title: 'Verified Providers',
      description: 'All providers are verified to ensure safety and trust.',
      bgColor: 'bg-green-100'
    },
    {
      icon: '❤️',
      title: 'Easy Adoption',
      description: 'Simple steps from discovery to adoption.',
      bgColor: 'bg-orange-100'
    },
    {
      icon: '💬',
      title: 'Ongoing Support',
      description: 'We&apos;re here to support you every step of the way.',
      bgColor: 'bg-blue-100'
    }
  ]

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
          Why Choose PawMatch?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="space-y-4">
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center text-3xl`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-black">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
