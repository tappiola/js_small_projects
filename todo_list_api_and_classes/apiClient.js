class ApiClient {
    static HOST = 'https://todoappexamplejs.herokuapp.com/items'

    static createTodo = async newContent => {
        const body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newContent)
        }
        const resp = await fetch(this.HOST, body);
        return await resp.json();
    }

    static retrieveTodos = async () => {
        const result = await fetch(this.HOST + '.json');
        return await result.json();
    }

    static updateTodo = async (id, newContent) => {
        const body = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newContent)
        }
        const resp = await fetch(this.HOST + '/' + id, body);
        return await resp.json();
    }

    static deleteTodo = async id => {
        const body = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        }
        await fetch(this.HOST + '/' + id, body);
    }
}
