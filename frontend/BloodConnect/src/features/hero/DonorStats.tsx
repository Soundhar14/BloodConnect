import React, { useState, useEffect } from 'react';
import app from '../../api/axios'

// Define the shape of data for each stat card
interface StatCardProps {
  count: number | string;
  title: string;
  description: string;
}

// StatCard Component
const StatCard: React.FC<StatCardProps> = ({ count, title, description }) => {
  return (
    <div
      className="bg-white shadow-lg"
      style={{
        width: 400,
        height: 430,
        padding: '50px 25px',
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Count */}
      <div
        style={{
          width: 350,
          height: 85,
          fontSize: 72,
          fontWeight: 'bold',
          color: '#dc2626',
          lineHeight: 1,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 0 ,
        }}
      >
        {count}
      </div>

      {/* First Divider */}
      <hr
        style={{
          width: 350,
          border: 'none',
          borderTop: '2px solid rgba(220, 38, 38, 0.5)', // red with 50% opacity
          marginTop: 10,
          marginBottom: 10,
        }}
      />

      {/* Title */}
      <div
        style={{
          width: 350,
          height: 50,
          fontSize: 36,
          fontWeight: 600,
          color: '#1f2937',
          lineHeight: 1.2,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 0,
        }}
      >
        {title}
      </div>

      {/* Second Divider */}
      <hr
        style={{
          width: 350,
          border: 'none',
          borderTop: '1px solid rgba(92, 90, 90, 0.5)', // #5C5A5A with 50% opacity
          marginTop: 10,
          marginBottom: 10,
        }}
      />

      {/* Description */}
      <div
        style={{
          width: 350,
          height: 150,
          fontSize: 20,
          color: '#4b5563',
          lineHeight: 1.3,
          textAlign: 'center',
          overflowWrap: 'break-word',
          overflowY: 'auto',
          paddingTop: 0,
          display: 'block',
        }}
      >
        {description}
      </div>
    </div>
  );
};

// DonorStats Component
const DonorStats = () => {

  const [totalDonors , setTotalDonors] = useState<number | string>('...');
  const [requestFullfiled , setRequestFullfiled] = useState<number | string>('...');
  const [citiesCovered , setCitiesCovered] = useState<number | string>('...');

  useEffect(() => {

    const FetchTotalDonors = async () => {
      try {
        const response = await app.get('/recipient/total-donor');
        setTotalDonors (response.data.totalDonors);
        console.log(totalDonors);
      } catch(error) {
        console.error('failed to fetch total donor count :' , error);
        setTotalDonors('Error');
      }
    };

    FetchTotalDonors();
  }, );

  useEffect(() => {
    const fetchRequestFullfiled = async () => {
      try {
        const response = await app.get('/recipient/request-fullfiled');
        setRequestFullfiled(response.data.requestFullfiled);
        console.log(requestFullfiled);
      } catch(error) {  
        console.log('failed to fetch the count of fullfilef request :' , error);
        setRequestFullfiled('Error');
      }
    };

    fetchRequestFullfiled();
  }, );

  useEffect(() => {
    const fetchCitiesCovered = async () => {
      try {
        const response = await app.get('/recipient/cities-covered');
        setCitiesCovered(response.data.citiesCovered);
        console.log(citiesCovered);
      } catch (error) {
        console.log('failed to fetch the count of cities covered :' , error);
        setCitiesCovered('Error');
      }
    };
    fetchCitiesCovered();
  });

    const stats = [
      {
        count: totalDonors,
        title: 'TOTAL DONORS',
        description: 'These people are actively participating in helping out the Seeker through us.',
      },
      {
        count: requestFullfiled,
        title: 'REQUEST FULLFILED',
        description: 'These are the number of seekers who have received help from our savers.',
      },
      {
        count: citiesCovered,
        title: 'CITIES COVERED',
        description:
          'These are the regions which we are working on to help the seekers by connecting them with the savers',
      },
    ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              count={stat.count}
              title={stat.title}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonorStats;
