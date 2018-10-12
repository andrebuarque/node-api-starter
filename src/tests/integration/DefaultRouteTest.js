import HttpStatus from 'http-status';

describe('Route Default', () => {
	describe('GET /', () => {
		it('should return "hello world!" string', done => {
			request
				.get('/')
				.expect(HttpStatus.OK)
				.expect(res => assert.equal(res.text, 'hello world!'))
				.end(done);
		});
	});
});
