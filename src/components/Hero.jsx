import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#CACACA]/20 via-white to-[#CACACA]/10 px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#CACACA]/20 text-[#683B0D] px-4 py-2 rounded-full">
              <span className="font-medium">For Pet Guardian and Pet Providers</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
              Connecting Pets with People,
              <span className="text-[#683B0D]"> Together.</span>
            </h1>

            <p className="text-lg text-[#989797] leading-relaxed">
              PawMatch is the all-in-one adoption platform that brings adopters and providers together to create happy, lifelong matches.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                className="px-8 py-4 bg-[#683B0D] text-white rounded-lg hover:bg-[#CEA74E] font-semibold text-lg flex items-center justify-center gap-2"
                onClick={() => navigate('/guardian/login')}
              >
                I Want to Adopt
              </button>
              <button
                className="px-8 py-4 border-2 border-[#683B0D] text-[#683B0D] rounded-lg hover:bg-[#CACACA]/10 font-semibold text-lg"
                onClick={() => navigate('/provider/login')}
              >
                I&apos;m a Pet Provider
              </button>
            </div>
          </div>

          {/* Right Side - Preview Cards */}
          <div className="space-y-6">
            <img
              src="/dashboard-guardian.png"
              alt="Dashboard Preview"
              className="w-full rounded-xl object-cover"
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-[#683B0D] font-bold text-lg">12K+</p>
                <p className="text-[#989797] text-xs mt-1">Pets Adopted</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-green-600 font-bold text-lg">2.5K+</p>
                <p className="text-[#989797] text-xs mt-1">Verified Providers</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-orange-600 font-bold text-lg">18K+</p>
                <p className="text-[#989797] text-xs mt-1">Happy Families</p>
              </div>
            </div>
          </div>
          </div>
        </div>

    </section>
  )
}
