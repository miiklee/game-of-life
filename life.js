let grid;


window.onload = function(){
    grid = [[0, 0, 0, 0, 0, 0, 0 ],
    [0, 0, 0, 0, 0, 0, 0 ],
    [0, 0, 0, 0, 0, 0,  0],
    [0, 0, 0, 0, 0, 0, 0 ],
    [0, 0, 0, 0, 0, 0, 0 ], 
    [0, 0, 0, 0, 0, 0, 0 ],
    [0, 0, 0, 0, 0, 0, 0 ],]
}

const playButton = document.getElementById('nextGen');
playButton.addEventListener('click', function() {
    
    solve()
    updateToCode()

}, false);

const musicButton = document.getElementById('music');
musicButton.addEventListener('click', function() {
    
    playMusic()

}, false);

const boxes = Array.from(document.querySelectorAll('.alive,.dead'));

boxes.forEach(box => {
    box.addEventListener('click', function() {
        if (box.getAttribute('class') == 'alive'){
            box.setAttribute('class', 'dead');
        }else{
            box.setAttribute('class', 'alive');
        }
        updateToHuman();
    
    }, false);
});


function updateToCode(){

	for(let i=1;i<6;i++){
		for(let j=1;j<6;j++){
            if (grid[i][j] == 1){
                document.getElementById(i.toString() + j.toString()).setAttribute('class', 'alive');
            }
            else{
                document.getElementById(i.toString() + j.toString()).setAttribute('class', 'dead');
            }
		}
	}
}

function updateToHuman(){

	for(let i=1;i<6;i++){
		for(let j=1;j<6;j++){
            if (document.getElementById(i.toString() + j.toString()).getAttribute('class') == 'alive'){
                grid[i][j] = 1;
            }
            else{
                grid[i][j] = 0;
            }
		}
	}
}



function solve(){
    let newGrid = [[], [], [], [], [], [], []];
    for (let i = 0; i<7; i++){
        for (let j = 0; j<7; j++){
            newGrid[i][j] = grid[i][j];
        }
    }
    for (let i = 1; i<6; i++){
        for (let j = 1; j<6; j++){
            let change = 0;
            if (grid[i-1][j-1] > 0){
                change++;
            }
            if (grid[i-1][j] > 0){
                change++;
            }
            if (grid[i-1][j+1] > 0){
                change++;
            }
            if (grid[i][j-1] > 0){
                change++;
            }
            if (grid[i][j+1] > 0){
                change++;
            }
            if (grid[i+1][j-1] > 0){
                change++;
            }
            if (grid[i+1][j] > 0){
                change++;
            }
            if (grid[i+1][j+1] > 0){
                change++;
            }

            if (grid[i][j] > 0 && !(change == 2 || change == 3)){
                newGrid[i][j] = 0;
            }
            if (grid[i][j] == 0 && change == 3){
                newGrid[i][j] = 1;
            }
        }
    }
    for (let i = 0; i<7; i++){
        for (let j = 1; j<7; j++){
            grid[i][j] = newGrid[i][j];
        }
    }
}


//map keyboard keys to frequencies
const boardFrequencyMap = {
    '11': 261.625565300598634,  // C
    '12': 277.182630976872096, // C#
    '13': 293.664767917407560,  // D
    '14': 311.126983722080910, // D#
    '15': 329.627556912869929,  // E
    '21': 349.228231433003884,  // F
    '22': 369.994422711634398, // F#
    '23': 391.995435981749294,  // G
    '24': 415.304697579945138, // G#
    '25': 440.000000000000000,  // A
    '31': 466.163761518089916, // A#
    '32': 493.883301256124111,  // B
    '33': 523.251130601197269,  // C
    '34': 554.365261953744192, // C#
    '35': 587.329535834815120,  // D
    '41': 622.253967444161821, // D#
    '42': 659.255113825739859,  // E
    '43': 698.456462866007768,  //F
    '44': 739.988845423268797, //F#
    '45': 783.990871963498588,  //G
    '51': 830.609395159890277, //G#
    '52': 880.000000000000000,  // A
    '53': 932.327523036179832, //A#
    '54': 987.766602512248223,  //B
    '55': 1046.50,  // C
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const globalGain = audioCtx.createGain(); //this will control the volume of all notes
globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
globalGain.connect(audioCtx.destination);

function playMusic(){
    let alive = 0.0;
    activeOscillators = {}
    activeGains = {}
    keys = []
    
    for(let i=1;i<6;i++){
		for(let j=1;j<6;j++){
            if (grid[i][j] == 1){
                alive = alive + 1.0;
                let key = (i.toString() + j.toString());
                keys.push(key);
                const osc = audioCtx.createOscillator();
                osc.type = 'sine'
                osc.frequency.setValueAtTime(boardFrequencyMap[key], audioCtx.currentTime);
                const gainNode = audioCtx.createGain();
                gainNode.gain.value = 0;
                osc.connect(gainNode).connect(globalGain);
                activeOscillators[key] = osc
                activeGains[key] = gainNode;
                
            }
            
		}
	}
    keys.forEach(key => {
        activeOscillators[key].start();
        activeGains[key].gain.setTargetAtTime((0.8/alive), audioCtx.currentTime, 0.2) //envelope attack
        activeGains[key].gain.setTargetAtTime(0, audioCtx.currentTime+1.0, 0.2) //envelope release
    });

}

