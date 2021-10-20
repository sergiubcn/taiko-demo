const { goto, openBrowser, clear, closeBrowser, write, text, textBox, click, into, intercept } = require("taiko");

const APP_BASE_URL = 'https://the-internet.herokuapp.com';

describe('Taiko Demo with Jest', () => {
    beforeEach(async() => {
        await openBrowser({headless: false});
        await deleteCookies();
    });

    it('should handle a basic form', async () => {
        await goto(`${APP_BASE_URL}/login`);
        await write('tomsmith', into(textBox({id:'username'})));
        await write('SuperSecretPassword!', into(textBox('Password')));
        await click('Login');
        expect(await text('Secure Area').exists()).toBeTruthy();
    });

    it('should handle shadow dom', async () => {
        await goto(`${APP_BASE_URL}/shadowdom`);
        expect(await text("Let's have some different text!").exists()).toBeTruthy();
    });

    it('should handle iframe', async () => {
        const dummyText = 'Taiko Automation!';
        await goto(`${APP_BASE_URL}/iframe`);
        expect(await text("Your content goes here.").exists()).toBeTruthy();
        await clear(textBox({id:'tinymce'}));
        await write(dummyText, into(textBox({id:'tinymce'})));
        expect(await text(dummyText).exists()).toBeTruthy();
    });

    it.skip('should intercept a request and provide mock object', async () => {
        const dummyText = `
        <!DOCTYPE html>
        <html>
          <head>
          </head>
          <body>
            TAIKO TEST
          </body>
        </html>
        `;
        await intercept(APP_BASE_URL, (request) => request.respond({dummyText}));
        await goto(`${APP_BASE_URL}`);
        
        expect(await text('TAIKO TEST').exists()).toBeTruthy();
    });

    it('should fail because it cannot find text', async () => {
        await goto(`${APP_BASE_URL}/shadowdom`);
        expect(await text("Your content goes here.").exists()).toBeTruthy();
    });

    afterEach(async() => {
        await closeBrowser();
    });
});
