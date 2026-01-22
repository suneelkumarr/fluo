import { 
  createSpinner, 
  createProgressBar, 
  typewriter, 
  countdown, 
  blink, 
  scrollText,
  loadingDots,
  spinners,
  bold,
  green,
  red,
  cyan
} from 'fluo-colors';

console.log(bold(cyan('\n=== ASYNC FEATURES TEST ===\n')));

// Test 1: Spinner
console.log(bold('1. Testing Spinner...\n'));
const spinner = createSpinner({
  text: 'Downloading packages...',
  spinner: 'dots'
});

spinner.start();

setTimeout(() => {
  spinner.succeed('Download complete!');
  
  // Test 2: Progress Bar
  console.log(bold('\n2. Testing Progress Bar...\n'));
  
  const bar = createProgressBar({ 
    total: 100,
    width: 30,
    complete: '=',
    incomplete: '-',
    format: ':bar :percent :eta'
  });

  const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
      clearInterval(timer);
      
      // Test 3: Typewriter
      console.log(bold('\n3. Testing Typewriter...\n'));
      typewriter('Welcome to the future of CLI...', { delay: 30 }).then(() => {
        
        // Test 4: Countdown
        console.log(bold('\n\n4. Testing Countdown...\n'));
        countdown(5, { format: (n) => `Launching in ${n}...` }).then(() => {
          
          console.log(green('\n🚀 Launch complete!\n'));
          
          // Test 5: Blinking (run for 2 seconds)
          console.log(bold('5. Testing Blink (2 seconds)...\n'));
          const blinking = blink('⚠ WARNING ⚠');
          blinking.start();
          
          setTimeout(() => {
            blinking.stop();
            console.log('\n');
            
            // Test 6: Loading Dots
            console.log(bold('6. Testing Loading Dots (2 seconds)...\n'));
            const dots = loadingDots('Processing');
            dots.start();
            
            setTimeout(() => {
              dots.stop();
              console.log('\n');
              
              // Test 7: Scroll Text
              console.log(bold('7. Testing Scroll Text (3 seconds)...\n'));
              const scroller = scrollText('Breaking News: Fluo is awesome! ', 40);
              scroller.start();
              
              setTimeout(() => {
                scroller.stop();
                console.log('\n');
                
                // Test 8: Available Spinners
                console.log(bold('8. Available Spinner Types:\n'));
                console.log('Spinner presets:', Object.keys(spinners).join(', '));
                
                console.log(bold(green('\n✓ All async features tested successfully!\n')));
                
              }, 3000);
            }, 2000);
          }, 2000);
        });
      });
    }
  }, 50);
  
}, 2000);
