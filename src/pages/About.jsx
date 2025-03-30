import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white dark:bg-gray-800">
      {/* Hero section */}
      <div className="relative py-16 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
            <svg
              className="absolute top-12 left-full transform translate-x-32"
              width="404"
              height="384"
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
            </svg>
            <svg
              className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
              width="404"
              height="384"
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
            </svg>
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-primary-600 font-semibold tracking-wide uppercase">
                About Us
              </span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Empowering Skills Development
              </span>
            </h1>
            <p className="mt-8 text-xl text-gray-500 dark:text-white leading-8">
              SkillHub is a comprehensive platform designed to help individuals assess their skills, 
              earn recognized credentials, and connect with learning opportunities tailored to their needs.
            </p>
          </div>
          <div className="mt-6 prose prose-indigo prose-lg text-gray-500 dark:text-white mx-auto max-w-[65%]">
            <h2>Our Mission</h2>
            <p>
              At SkillHub, we believe that everyone should have access to quality skill assessment and 
              credentialing. Our mission is to bridge the gap between learning and employment by providing 
              a platform where individuals can demonstrate their abilities and receive recognition for their skills.
            </p>
            
            <h2>What We Offer</h2>
            <ul>
              <li>
                <strong>Comprehensive Skill Assessments:</strong> Our platform offers a wide range of assessments 
                designed to evaluate both technical and soft skills across various domains.
              </li>
              <li>
                <strong>Micro-Credentials:</strong> Earn verified micro-credentials that showcase your expertise 
                to potential employers and educational institutions.
              </li>
              <li>
                <strong>Personalized Learning Paths:</strong> Receive AI-powered recommendations for learning 
                resources based on your assessment results and career goals.
              </li>
              <li>
                <strong>Community Learning:</strong> Connect with peers, join discussion forums, and collaborate 
                on projects to enhance your skills through practical application.
              </li>
            </ul>
            
            <h2>Our Approach</h2>
            <p>
              We take a holistic approach to skill development, focusing on:
            </p>
            <ul>
              <li>
                <strong>Practical Assessment:</strong> Our assessments go beyond theoretical knowledge to evaluate 
                practical application of skills.
              </li>
              <li>
                <strong>Continuous Learning:</strong> We encourage lifelong learning through regular skill updates 
                and new credential opportunities.
              </li>
              <li>
                <strong>Industry Relevance:</strong> Our assessments and credentials are designed in collaboration 
                with industry experts to ensure they reflect current market needs.
              </li>
              <li>
                <strong>Accessibility:</strong> We strive to make our platform accessible to learners from diverse 
                backgrounds and with varying levels of experience.
              </li>
            </ul>
            
            <h2>Join Us</h2>
            <p>
              Whether you're looking to showcase your existing skills, identify areas for improvement, or explore 
              new learning opportunities, SkillHub is here to support your journey. Join our community today and 
              take the first step toward advancing your career.
            </p>
            
            <div className="mt-10">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 