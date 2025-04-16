import { useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  timeAgo: string;
  image: string;
}

export default function Testimonials() {
  const [testimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Sarah L.",
      role: "Tenant",
      text: "Estate Empire saved me so much time! I was pre-approved for apartments that matched my budget and needs, and I could schedule viewings immediately. Found my dream place in 2 days instead of weeks.",
      rating: 5,
      timeAgo: "2 months ago",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    {
      id: 2,
      name: "Robert J.",
      role: "Landlord",
      text: "As a property owner with multiple units, Estate Empire has been a game-changer. I only show apartments to pre-qualified tenants, cutting my vacancy times in half and increasing my rental income.",
      rating: 4.5,
      timeAgo: "1 month ago",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    },
    {
      id: 3,
      name: "David M.",
      role: "Property Manager",
      text: "The credential scoring system is incredibly accurate. We've reduced our application review time by 80% and found better quality tenants who stay longer. Well worth the investment.",
      rating: 5,
      timeAgo: "3 months ago",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
    }
  ]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#F59E0B] bg-opacity-10 px-4 py-2 rounded-full text-[#F59E0B] font-medium text-sm mb-4">
            Success Stories
          </div>
          <h2 className="text-3xl font-bold text-[#0D1929] mb-4">Hear from Our Users</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from tenants and landlords who have experienced the Estate Empire difference.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src={testimonial.image} 
                  alt={`${testimonial.name}'s profile picture`} 
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-[#0D1929]">{testimonial.name}</h4>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-1 text-yellow-400">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="text-gray-400 text-sm">{testimonial.timeAgo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
