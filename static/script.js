document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let disksCount = 2;
    let towers = [[], [], []];
    let selectedDisk = null;
    let selectedTower = null;
    let moves = 0;
    let playerName = document.querySelector('h2').textContent.replace('Player: ', '');
    
    // DOM elements
    const towersContainer = document.getElementById('towers');
    const replayBtn = document.getElementById('replay-btn');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const winModal = document.getElementById('win-modal');
    const modalReplay = document.getElementById('modal-replay');
    const modalNext = document.getElementById('modal-next');
    
    // Animation constants
    const ANIMATION_DURATION = 500; // ms
    const LIFT_HEIGHT = 100; // px
    
    // Initialize game
    initGame();
    
    // Event listeners
    replayBtn.addEventListener('click', () => {
        resetGame(disksCount);
    });
    
    nextLevelBtn.addEventListener('click', () => {
        resetGame(disksCount + 1);
    });
    
    modalReplay.addEventListener('click', () => {
        winModal.classList.add('hidden');
        resetGame(disksCount);
    });
    
    modalNext.addEventListener('click', () => {
        winModal.classList.add('hidden');
        resetGame(disksCount + 1);
    });
    
    // Initialize the game
    function initGame() {
        // Clear towers
        towersContainer.innerHTML = '';
        towers = [[], [], []];
        
        // Create towers
        for (let i = 0; i < 3; i++) {
            const tower = document.createElement('div');
            tower.className = 'tower';
            tower.dataset.index = i;
            tower.addEventListener('click', () => handleTowerClick(i));
            towersContainer.appendChild(tower);
        }
        
        // Create disks
        for (let i = disksCount; i > 0; i--) {
            const disk = document.createElement('div');
            disk.className = 'disk';
            disk.dataset.size = i;
            disk.style.width = `${60 + i * 30}px`;
            disk.style.backgroundColor = getDiskColor(i);
            disk.textContent = i;
            disk.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDiskClick(i);
            });
            
            towers[0].push(i);
            document.querySelector(`.tower[data-index="0"]`).appendChild(disk);
        }
    }
    
    // Handle disk click
    function handleDiskClick(diskSize) {
        // Find which tower this disk is on
        const towerIndex = towers.findIndex(tower => tower.length > 0 && tower[tower.length - 1] === diskSize);
        
        if (towerIndex === -1) return;
        
        // Only allow selecting the top disk
        if (towers[towerIndex][towers[towerIndex].length - 1] !== diskSize) return;
        
        // Deselect if clicking the same disk
        if (selectedDisk === diskSize) {
            deselectDisk();
            return;
        }
        
        // Deselect any previous selection
        deselectDisk();
        
        // Select this disk
        selectedDisk = diskSize;
        selectedTower = towerIndex;
        
        // Highlight the disk and its tower
        const diskElement = document.querySelector(`.tower[data-index="${towerIndex}"] .disk[data-size="${diskSize}"]`);
        const towerElement = document.querySelector(`.tower[data-index="${towerIndex}"]`);
        
        if (diskElement) {
            diskElement.classList.add('selected');
            // Lift the disk slightly
            diskElement.style.transform = `translateY(-${LIFT_HEIGHT}px)`;
        }
        if (towerElement) towerElement.classList.add('selected');
    }
    
    // Handle tower click
    function handleTowerClick(towerIndex) {
        // If we have a disk selected, try to move it to this tower
        if (selectedDisk !== null) {
            const targetTower = towers[towerIndex];
            
            // Check if move is valid
            if (targetTower.length === 0 || selectedDisk < targetTower[targetTower.length - 1]) {
                // Valid move - perform the move with animation
                moveDiskWithAnimation(selectedTower, towerIndex);
            } else {
                // Invalid move - show error animation
                showInvalidMoveAnimation(towerIndex);
            }
            
            // Deselect after move attempt
            deselectDisk();
        } else {
            // No disk selected - select the top disk of this tower if it exists
            if (towers[towerIndex].length > 0) {
                const topDisk = towers[towerIndex][towers[towerIndex].length - 1];
                handleDiskClick(topDisk);
            }
        }
    }
    
    // Move disk with realistic animation
    function moveDiskWithAnimation(fromTowerIndex, toTowerIndex) {
        const diskSize = selectedDisk;
        const fromTower = towers[fromTowerIndex];
        const toTower = towers[toTowerIndex];
        
        // Get DOM elements
        const diskElement = document.querySelector(`.tower[data-index="${fromTowerIndex}"] .disk[data-size="${diskSize}"]`);
        const toTowerElement = document.querySelector(`.tower[data-index="${toTowerIndex}"]`);
        
        if (!diskElement || !toTowerElement) return;
        
        // Calculate positions
        const diskRect = diskElement.getBoundingClientRect();
        const toTowerRect = toTowerElement.getBoundingClientRect();
        
        // Calculate how many disks are on target tower (for placement height)
        const targetDisksCount = toTower.length;
        const diskHeight = 35; // height + margin
        
        // Prepare for animation
        diskElement.style.transition = `all ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        diskElement.style.position = 'absolute';
        diskElement.style.left = `${diskRect.left}px`;
        diskElement.style.top = `${diskRect.top}px`;
        diskElement.style.zIndex = '100';
        diskElement.classList.add('moving');
        
        // Animation sequence
        setTimeout(() => {
            // 1. Lift up
            diskElement.style.top = `${diskRect.top - LIFT_HEIGHT}px`;
            
            setTimeout(() => {
                // 2. Move horizontally to target tower
                diskElement.style.left = `${toTowerRect.left}px`;
                
                setTimeout(() => {
                    // 3. Place down on target tower
                    const newTop = toTowerRect.top - (targetDisksCount * diskHeight) - LIFT_HEIGHT;
                    diskElement.style.top = `${newTop}px`;
                    
                    setTimeout(() => {
                        // Animation complete - update game state
                        diskElement.style.transition = '';
                        diskElement.style.position = '';
                        diskElement.style.left = '';
                        diskElement.style.top = '';
                        diskElement.style.zIndex = '';
                        diskElement.classList.remove('moving');
                        diskElement.style.transform = '';
                        
                        // Update towers array
                        fromTower.pop();
                        toTower.push(diskSize);
                        
                        // Append to new tower
                        toTowerElement.appendChild(diskElement);
                        
                        moves++;
                        
                        // Check for win
                        if (checkWin()) {
                            setTimeout(showWinModal, 500);
                        }
                    }, ANIMATION_DURATION / 3);
                }, ANIMATION_DURATION / 3);
            }, ANIMATION_DURATION / 3);
        }, 10);
    }
    
    // Show invalid move animation
    function showInvalidMoveAnimation(towerIndex) {
        const towerElement = document.querySelector(`.tower[data-index="${towerIndex}"]`);
        if (!towerElement) return;
        
        towerElement.style.transform = 'translateX(10px)';
        setTimeout(() => {
            towerElement.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                towerElement.style.transform = '';
            }, 100);
        }, 100);
    }
    
    // Deselect current disk
    function deselectDisk() {
        if (selectedDisk !== null) {
            const diskElement = document.querySelector(`.disk[data-size="${selectedDisk}"].selected`);
            const towerElement = document.querySelector(`.tower[data-index="${selectedTower}"].selected`);
            
            if (diskElement) {
                diskElement.classList.remove('selected');
                diskElement.style.transform = '';
            }
            if (towerElement) towerElement.classList.remove('selected');
            
            selectedDisk = null;
            selectedTower = null;
        }
    }
    
    // Check if player has won
    function checkWin() {
        return towers[2].length === disksCount || towers[1].length === disksCount;
    }
    
    // Show win modal
    function showWinModal() {
        winModal.classList.remove('hidden');
        replayBtn.classList.remove('hidden');
        nextLevelBtn.classList.remove('hidden');
    }
    
    // Reset the game
    function resetGame(newDisksCount) {
        disksCount = newDisksCount;
        moves = 0;
        selectedDisk = null;
        selectedTower = null;
        replayBtn.classList.add('hidden');
        nextLevelBtn.classList.add('hidden');
        initGame();
    }
    
    // Get disk color based on size
    function getDiskColor(size) {
        const colors = [
            '#e74c3c', // red
            '#e67e22', // orange
            '#f1c40f', // yellow
            '#2ecc71', // green
            '#3498db', // blue
            '#9b59b6', // purple
            '#1abc9c', // turquoise
            '#d35400'  // pumpkin
        ];
        return colors[(size - 1) % colors.length];
    }
});
