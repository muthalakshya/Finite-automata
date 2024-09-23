document.addEventListener('DOMContentLoaded', function () {
    function alertFunction(txt,iconName) {
        swal.fire({
          icon: iconName,
          title: txt,
          allowOutsideClick: false,
          target: '#main-box',
          customClass: {                      // <------ customClass is an object!
            container: 'position-absolute'
          }
        });
    }
    function updateString(str, index, style) {
        // Split the string into an array of characters
        let chars = str.split('');
        // Apply style to the character at the specified index
        chars[index] = `<span style="font-size:${style.fontSize}; color:${style.color};">${chars[index]}</span>`;   
        // Join the array back into a string and return
        return chars.join('');
    }
    let a=8;
    const jsPlumbInstance = jsPlumb.getInstance();
    const connections = {
        '0-1': jsPlumbInstance.connect({
            source: 'state0',
            target: 'state1',
            anchors: ['Right', 'Left'],
            endpoint: 'Blank',
            connector: ['Straight'],
            overlays: [['Arrow', {
                location: 0.88, // Position at the end of the connection
                width: 40,   // Arrow width
                length: 40,  // Arrow length
                direction: 1, // 1 means arrow pointing from source to target
                foldback: 0.7, // Controls the sharpness of the arrowhead
                paintStyle: { fill: "black" }
            }]],
            paintStyle: { strokeWidth: 8, stroke: '#00f' }
        }),
        '1-2': jsPlumbInstance.connect({
            source: 'state1',
            target: 'state2',
            anchors: ['Right', 'Left'],
            endpoint: 'Blank',
            connector: ['Straight'],
            overlays: [['Arrow', {
                location: 0.88, // Position at the end of the connection
                width: 40,   // Arrow width
                length: 40,  // Arrow length
                direction: 1, // 1 means arrow pointing from source to target
                foldback: 0.7, // Controls the sharpness of the arrowhead
                paintStyle: { fill: "black" }
            }]],
            paintStyle: { strokeWidth: 8, stroke: '#00f' }
        }),
        '2-3': jsPlumbInstance.connect({
            source: 'state2',
            target: 'state3',
            anchors: ['Right', 'Left'],
            endpoint: 'Blank',
            connector: ['Straight'],
            overlays: [['Arrow', {
                location: 0.88, // Position at the end of the connection
                width: 40,   // Arrow width
                length: 40,  // Arrow length
                direction: 1, // 1 means arrow pointing from source to target
                foldback: 0.7, // Controls the sharpness of the arrowhead
                paintStyle: { fill: "black" }
            }]],
            paintStyle: { strokeWidth: 8, stroke: '#00f' }
        }),
        '3-4': jsPlumbInstance.connect({
            source: 'state3',
            target: 'state4',
            anchors: ['Right', 'Left'],
            endpoint: 'Blank',
            connector: ['Straight'],
            overlays: [['Arrow', {
                location: 0.88, // Position at the end of the connection
                width: 40,   // Arrow width
                length: 40,  // Arrow length
                direction: 1, // 1 means arrow pointing from source to target
                foldback: 0.7, // Controls the sharpness of the arrowhead
                paintStyle: { fill: "black" }
            }]],
            paintStyle: { strokeWidth: 8, stroke: '#00f' }
        }),
        '0-0': jsPlumbInstance.connect({
            source: 'state0',
            target: 'state0',
            anchors: ['Top', 'Top'],
            endpoint: 'Blank',
            connector: ['Bezier', { curviness: 50 }],
            overlays: [['Arrow', {
                location: 0.5, // Position at the end of the connection
                width: 30,   // Arrow width
                length: 25,  // Arrow length
                direction: 1, // 1 means arrow pointing from source to target
                foldback: 0.7, // Controls the sharpness of the arrowhead
                paintStyle: { fill: "white" }
            }]],
            paintStyle: { strokeWidth: 8, stroke: 'black' },
        }),
        '4-4': jsPlumbInstance.connect({
            source: 'state4',
            target: 'state4',
            anchors: ['Top', 'Top'],
            endpoint: 'Blank',
            connector: ['Bezier', { curviness: 50 }],
            overlays: [['Arrow', { 
                location: 0.5, // Position at the end of the connection
                width: 30,   // Arrow width
                length: 25,  // Arrow length
                direction: 1, // 1 means arrow pointing from source to target
                foldback: 0.7, // Controls the sharpness of the arrowhead
                paintStyle: { fill: "white" }
            }]],
            paintStyle: { strokeWidth: 8, stroke: 'black' },
        })
    };
    function simulate() {
        a=8;
        // movingDiv.css("transition","width 0s")
        // movingDiv.css("left",`0%`)
        // movingDiv.css("transition","top 0.2s ease-in-out, left 0.2s ease-in-out")
        const transitions = {
            0: { '0': { nextState: 1, conn: '0-1' }, '1': { nextState: 0, conn: '0-0' } },
            1: { '0': { nextState: 1, conn: '0-0' }, '1': { nextState: 2, conn: '1-2' } },
            2: { '0': { nextState: 3, conn: '2-3' }, '1': { nextState: 2, conn: '1-2' } },
            3: { '0': { nextState: 3, conn: '2-3' }, '1': { nextState: 4, conn: '3-4' } },
            4: { '0': { nextState: 4, conn: '4-4' }, '1': { nextState: 4, conn: '4-4' } }
        };
        let currentState = 0;
        const inputString = document.getElementById('inputString').value;
        const resultElement = document.getElementById('result');
        const statesElements = document.querySelectorAll('.state');
        $(".dis").text(inputString)
        // Reset the visualization
        statesElements.forEach(s => s.classList.remove('active'));
        Object.values(connections).forEach(conn => conn.canvas.classList.remove('connection-active', 'connection-hovering'));
        resultElement.textContent = "";
        // Process the string one symbol at a time with a delay
        let i = 0;
        function processNextSymbol() {
            if (i < inputString.length) {
                const symbol = inputString[i];
                console.log(i,symbol)
                let originalText = $('.dis').text();  // Get the original text from the <p> element
                let updatedText = updateString(originalText, i, { fontSize: '48px', color: '#00ff00 ' }); // Update the string
                $('.dis').html(updatedText);
                // $(".dis").text(symbol)
                if (transitions[currentState][symbol] !== undefined) {
                    const transition = transitions[currentState][symbol];
                    currentState = transition.nextState;
                    a+=18;
                    highlightState(currentState);
                    highlightConnection(transition.conn);
                    hoverConnection(transition.conn);
                    i++;
                    setTimeout(() => {
                        unhoverConnection(transition.conn);
                        processNextSymbol();
                    }, 1000);  // Delay of 1 second between each step
                } else {
                    resultElement.textContent = "Rejected";
                    alertFunction("Rejected","error");
                    // movingDiv.css("transition","width 0s")
                    // movingDiv.css("left",`8%`)
                    a=8;
                }
            } else {
                if (currentState === 4) {
                    resultElement.textContent = "Accepted";
                    alertFunction("Accepted","success");
                    // movingDiv.css("transition","width 0s")
                    // movingDiv.css("left",`8%`)
                } else {
                    resultElement.textContent = "Rejected";
                    alertFunction("Rejected","error");
                    // movingDiv.css("transition","width 0s")
                    // movingDiv.css("left",`8%`)
                }
            }
        }
        processNextSymbol();  // Start processing the first symbol
    }
    // var movingDiv = $('#movingDiv');
    function highlightState(state) {
        // movingDiv.css("left",`${a}%`)
        const states = document.querySelectorAll('.state');
        states.forEach(s => s.classList.remove('active'));
        document.getElementById(`state${state}`).classList.add('active');
    }
    function highlightConnection(connName) {
        Object.values(connections).forEach(conn => conn.canvas.classList.remove('connection-active'));
        connections[connName].canvas.classList.add('connection-active');
        // $(`.sub${connName}`).addClass('colorON');
        $('.box').each(function() {
            // Check if the element has a class that matches the condition
            if ($(this).hasClass(`sub${connName}`)) {
                // If it matches, add a new class (e.g., 'active')
                $(this).addClass('colorON');
            } else {
                // If it doesn't match, remove the 'active' class if it exists
                $(this).removeClass('colorON');
            }
        });
    }
    function hoverConnection(connName) {
        connections[connName].canvas.classList.add('connection-hovering');
    }
    function unhoverConnection(connName) {
        connections[connName].canvas.classList.remove('connection-hovering');
    }
    // Attach the simulate function to the global scope
    window.simulate = simulate;
});