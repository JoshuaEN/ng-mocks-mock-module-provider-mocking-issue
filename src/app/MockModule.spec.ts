import { Injectable, NgModule } from "@angular/core";
import { TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';
import { ngMocksUniverse } from 'ng-mocks/dist/lib/common/ng-mocks-universe';

describe('for services inside a module', () => {
    @Injectable()
    class ExampleProvider {
      a = 5;
    }
    @NgModule({
      providers: [ExampleProvider],
    })
    class ExampleModule {}

    let exampleProvider: ExampleProvider;

    // Test order is important, since we are testing side effects between tests. A random order would result in false positives.
    // To detect these, the setup phase sets this flag, and the validation phase checks that it was set.
    let testOrderValidationFlag = false;

    beforeAll(() => {
        // Uncommenting both of these lines allows the tests to pass.
        // ngMocksUniverse.flags.delete('cacheModule');
        // ngMocksUniverse.flags.delete('cacheProvider');
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MockModule(ExampleModule)],
        });

        exampleProvider = TestBed.inject(ExampleProvider);
    });

    it('should not be able to pass state between tests (setup phase)', () => {
        // Set a property on the class to see if it carries over to the next test.
        exampleProvider.a = 11;

        testOrderValidationFlag = true;
    });

    it('should not be able to pass state between tests (validation phase)', () => {
        expect(testOrderValidationFlag).toBeTrue();
        expect(exampleProvider.a).toBeUndefined();
    });
});