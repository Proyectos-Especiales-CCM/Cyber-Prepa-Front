"use client"

import { useState, useRef, createRef } from 'react';
import { rules } from './rules';
import './styles.css';

interface RegulationCardProps {
  title: string;
  description: string;
  backgroundClass?: string;
  className?: string;
  id?: string;
  ref?: React.RefObject<HTMLLIElement>;
}

const RegulationCard: React.FC<RegulationCardProps> = ({ title, description, backgroundClass = "background1", className, id, ref }) => {
  return (
    <li
      id={id}
      ref={ref}
      tabIndex={-1}
      className={`p-4 ${backgroundClass} ${className} focus:outline-none focus:ring-8 focus:ring-red-500`}
    >
      <h3 className="text-2xl">{title}</h3>
      <p className="text-sm mt-2">
        {description}
      </p>
    </li>
  );
};

const Reglamento = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const cardRefs = useRef<{ [key: string]: React.RefObject<HTMLLIElement> }>({});

  const filteredRegulations = rules.filter((regulation) =>
    regulation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    regulation.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCardClick = (id: string) => {
    const cardRef = cardRefs.current[id];
    if (cardRef && cardRef.current) {
      cardRef.current.focus();
    }
  };

  return (
    <div className="mdl-layout flex max-h-screen">
      <div className="overflow-y-scroll min-w-52 hidden lg:block">
        <span className="text-white text-xl font-semibold my-6 mx-10 block">Reglas</span>
        <nav>
          {rules.map((regulation) => (
            <a
              key={regulation.id}
              className="block flex-shrink-0 py-4 px-10 text-gray-300 font-light no-underline opacity-87 transition-colors duration-500 hover:bg-neutral-800"
              href={`#regulation-${regulation.id}`}
              onClick={() => handleCardClick(`regulation-${regulation.id}`)}
            >
              {regulation.id}. {regulation.title}
            </a>
          ))}
        </nav>
      </div>
      <div className='flex flex-col'>
        <header className="flex justify-end p-5 bg-[#1c1e23] text-white">
          <div>
            <label className="mr-3" htmlFor="fixed-header-drawer-exp">
              Buscar en el reglamento
            </label>
            <input
              className="py-2 px-3 border border-white border-opacity-50 rounded bg-transparent text-white outline-none focus:border-sky-600"
              type="text"
              id="fixed-header-drawer-exp"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </header>
        <main className="mdl-layout__content overflow-y-scroll text-white p-4">
          <div className="page-content">
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
              {filteredRegulations.map((regulation) => {
                if (!cardRefs.current[`regulation-${regulation.id}`]) {
                  cardRefs.current[`regulation-${regulation.id}`] = createRef();
                }

                return (
                  <RegulationCard
                    key={regulation.id}
                    id={`regulation-${regulation.id}`}
                    title={regulation.title}
                    description={regulation.description}
                    backgroundClass={regulation.backgroundClass}
                    ref={cardRefs.current[`regulation-${regulation.id}`]}
                  />
                );
              })}
            </ul>

            <ul className='mt-10'>
              <RegulationCard
                key={rules.length + 1}
                id="regulation-final"
                title={'Atentamente: Cyber Prepa CCM'}
                description={'Cualquier duda y/o aclaración, favor de acudir con los responsables del área del área.'}
                ref={cardRefs.current['regulation-final']}
              />
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reglamento;
