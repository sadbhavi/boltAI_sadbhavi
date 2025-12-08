
import React from 'react';
import Hero from './Hero';
import EmotionalSupport from './EmotionalSupport';
import SoundscapePlayer from './SoundscapePlayer';
import SleepStories from './SleepStories';
import Features from './Features';
import BreathingExercises from './BreathingExercises';
import About from './About';
import Pricing from './Pricing';
import Blog from './Blog';
import Download from './Download';
// import SurroundingListing from './SurroundingListing';

const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <section id="emotional-support">
                <EmotionalSupport />
            </section>
            {/* <section id="nearby">
                <SurroundingListing />
            </section> */}
            <SoundscapePlayer />
            <SleepStories />
            <Features />
            <BreathingExercises />
            <About />
            <Pricing />
            <Blog />
            <Download />
        </>
    );
};

export default Home;
