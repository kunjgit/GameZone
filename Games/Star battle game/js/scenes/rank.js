class Rank extends Scene {
    setup() {
        super.setup();
        this.event();
        this.storageDataKey = "gameData";
        this.addData();
        this.rank();
    }

    addData() {
        const key = this.storageDataKey;
        const {
            name,
            score,
            time,
        } = this.game.data;
        localStorageData.add(key, {
            name,
            score,
            time,
        });
    }

    rank() {
        const key = this.storageDataKey;
        let html = "";
        let position = 0;
        let data = [].concat(localStorageData.get(key).data);
        const some = (a, b) => {
            return (
                (a.score === b.score) && (a.time === b.time)
            );
        }
        data.sort((a, b) => {
            if (a.score === b.score) {
                return a.time < b.time ? 1 : -1;
            }
            return a.score < b.score ? 1 : -1;
        });
        setTimeout(() => {
            localStorageData.update(key, data);
            data.map((el, index) => {
                const prev = data[index - 1];
                if (prev) {
                    position += some(prev, el) ? 0 : 1;
                } else {
                    position++;
                }
                html += `
                 <tr>
                     <td>${numberFormat(position)}</td>
                     <td>${el.name}</td>
                     <td>${numberFormat(el.score)}</td>
                     <td>${numberFormat(el.time)}</td>
                 </tr>
             `;
            });
            $('#rank table tbody').innerHTML = html;
        }, 0);
    }

    event() {
        on(
            $('#restart-btn'),
            'click',
            () => {
                this.game.start();
            }
        )
    }
}