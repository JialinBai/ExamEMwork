function getUrgentPatient(queue, currentTime) {
    return [...queue]
        .sort((a, b) => {
            let priorityA = a.category === 'E' ? 2 : 1;
            let priorityB = b.category === 'E' ? 2 : 1;

            const waitTimeA = currentTime - a.arrivalTime;
            const waitTimeB = currentTime - b.arrivalTime;

            if (a.category === 'N' && waitTimeA > 60) {
                priorityA = 2;
            }

            if (b.category === 'N' && waitTimeB > 60) {
                priorityB = 2;
            }

            if (priorityA !== priorityB) {
                return priorityB - priorityA;
            }

            if (a.severity !== b.severity) {
                return b.severity - a.severity;
            }

            return a.arrivalTime - b.arrivalTime;
        })[0];
}