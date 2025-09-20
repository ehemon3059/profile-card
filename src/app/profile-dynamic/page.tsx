"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

const INITIAL_DATA = {
  name: "Md Emran Hossain EMON",
  title: "Software Engineer",
  subtitle: "Crafting digital solutions with precision and innovation",
  age: "31 years",
  position: "Software Engineer",
  Experience: "8 years",
  ledu:"B.SC in Computer Science and Engineering"


};

const MAX_LENGTHS = {
  name: 40,
  title: 35,
  subtitle: 80,
  age:10,
  position:"30",
  Experience:"15",
  ledu:"50"
  
};

export default function ProfileCard() {
  const [editing, setEditing] = useState(null);
  const [profileData, setProfileData] = useState(INITIAL_DATA);
  
  const refs = {
    name: useRef(null),
    title: useRef(null),
    subtitle: useRef(null),
    age: useRef(null),
    position: useRef(null),
    Experience: useRef(null),
    ledu: useRef(null)
  };

  // Focus element when entering edit mode
  useEffect(() => {
    if (editing && refs[editing]?.current) {
      refs[editing].current.focus();
      // Select all text for easier editing
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(refs[editing].current);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [editing]);

  const updateField = useCallback((field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field) => {
    const newText = refs[field].current?.innerText?.trim() || profileData[field];
    updateField(field, newText);
    setEditing(null);
  }, [profileData, updateField]);

  const handleKeyDown = useCallback((e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur(field);
    } else if (e.key === 'Escape') {
      // Reset to original value on escape
      refs[field].current.innerText = profileData[field];
      setEditing(null);
    }
  }, [profileData, handleBlur]);

  const handlePaste = useCallback((e, field) => {
    e.preventDefault();
    const plainText = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    const maxLength = MAX_LENGTHS[field];
    
    if (selection?.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const currentElement = refs[field].current;
      const currentText = currentElement.innerText;
      
      // Calculate the text that will remain after deletion
      const beforeSelection = currentText.substring(0, range.startOffset);
      const afterSelection = currentText.substring(range.endOffset);
      
      // Calculate available space
      const remainingSpace = maxLength - (beforeSelection.length + afterSelection.length);
      
      // Truncate paste text if it exceeds available space
      const textToPaste = remainingSpace > 0 
        ? plainText.substring(0, remainingSpace) 
        : '';
      
      if (textToPaste) {
        range.deleteContents();
        range.insertNode(document.createTextNode(textToPaste));
        
        // Move cursor to end of pasted text
        range.setStartAfter(range.endContainer);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  const handleInput = useCallback((field) => {
    const element = refs[field].current;
    const maxLength = MAX_LENGTHS[field];
    
    if (maxLength && element.innerText.length > maxLength) {
      const truncatedText = element.innerText.substring(0, maxLength);
      element.innerText = truncatedText;
      
      // Move cursor to end
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  const EditableText = ({ field, className, children }) => {
    const isEditing = editing === field;
    
    return (
      <div
        className={`relative ${className}`}
        onClick={() => setEditing(field)}
      >
        <span
          ref={refs[field]}
          className={`
             block w-full cursor-text outline-none
          ${isEditing ? 'border border-dashed border-blue-400 p-1 -m-1 rounded-md' : 'border border-transparent p-1 -m-1'}
            
          `}
          contentEditable
          suppressContentEditableWarning={true}
          onBlur={() => handleBlur(field)}
          onKeyDown={(e) => handleKeyDown(e, field)}
          onPaste={(e) => handlePaste(e, field)}
          onInput={() => handleInput(field)}
          role="textbox"
          aria-label={`Edit ${field}`}
        >
          {children}
        </span>
        {isEditing && (

          <div className="absolute -bottom-8 left-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border ">
            <div >Press Enter to save, Escape to cancel</div>
            <div className="text-gray-400">
              {refs[field].current?.innerText?.length || 0}/{MAX_LENGTHS[field]} characters
            </div>


          </div>


        )}
      </div>
    );
  };

  const ProfileIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 text-blue-600" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={2}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-3xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <EditableText 
            field="title" 
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            {profileData.title}
          </EditableText>
          <EditableText 
            field="subtitle" 
            className="text-blue-100 text-lg"
          >
            {profileData.subtitle}
          </EditableText>
        </div>
        
        {/* Main Content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Details Section */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                Details Info
              </h2>
              
                <div className="flex flex-col  space-y-5">
                
                    <div className="flex flex-row  items-center">

                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>


                        <div className='flex-1'>

                            <p className="text-sm text-gray-500">Name</p>
                            {/* <p className="text-lg font-medium text-gray-800">Md Emran Hossain EMON</p> */}
                            <EditableText 
                                field="name" 
                                className="text-lg font-medium text-gray-800"
                            >
                                {profileData.name}
                            </EditableText>
                        </div>

                    </div>
                   
                   

                        <div className="flex  flex-row items-center">

                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className='flex-1'>

                                <p className="text-sm text-gray-500">Age</p>

                                    <EditableText 
                                        field="age" 
                                        className="text-lg font-medium text-gray-800"
                                    >
                                        {profileData.age}
                                    </EditableText>

                                
                            </div>

                        </div>
                            
                            <div className="flex flex-row items-center">

                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <div className='flex-1'>

                                    <p className="text-sm text-gray-500">Position</p>
                                    <EditableText 
                                        field="position" 
                                        className="text-lg font-medium text-gray-800"
                                    >
                                        {profileData.position}
                                    </EditableText>
                                    

                                </div>

                            </div>
                            
                            <div className="flex flex-row items-center">

                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className='flex-1'>

                                    <p className="text-sm text-gray-500">Working Experience</p>


                                    <EditableText 
                                        field="Experience" 
                                        className="text-lg font-medium text-gray-800"
                                    >
                                        {profileData.Experience}
                                    </EditableText>
                                   


                                </div>

                            </div>


                             <div className="flex  flex-row items-center">

                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                    </svg>
                                </div>

                                <div  className='flex-1'>

                                    <p className="text-sm text-gray-500">Last Education</p>

                                    <EditableText 
                                        field="ledu" 
                                        className="text-lg font-medium text-gray-800"
                                    >
                                        {profileData.ledu}
                                    </EditableText>
                                </div>
                            </div>

                </div>




            </div>
            
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full shadow-lg" />
                <div className="absolute inset-2 bg-white rounded-full overflow-hidden">
                  <Image
                    src="/images/profile-picture.png"
                    alt={`Profile picture of ${profileData.name}`}
                    width={224}
                    height={224}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
              <p className="text-gray-600 text-center text-sm">Profile Picture</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-100 p-4 text-center border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} {profileData.name}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}