import ky from 'ky';

const srv = import.meta.env.VITE_REST_SERVER;

const fetch = {
    async balance (url) {
        const b = parseInt(await ky.get(url).json());
        let s = 10;
        if (b > 99999) {
            s = 7
        };
        if (b > 9999999) {
            s = 6
        };
        if (b > 999999999) {
            s = 5
        };
        return [b.toLocaleString(), s];
    },
    async send (q) {
        try {
            return await ky.post(srv + 'send/', {json: q}).json();
        } catch (e) {
            console.error(e);
            return {'success': 0};
        }
        
    }
};

export default fetch;