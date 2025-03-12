#include <iostream>
using namespace std;

int main() {
    char op;
    double x, y;
    cout << "+, -, *, /: ";
    cin >> op;
    cout << "x, y: ";
    cin >> x >> y;

    switch (op) {
    case '+':
        cout << x << "+" << y << "=" << x + y;
        break;
    case '-':
        cout << x << "-" << y << "=" << x - y;
        break;
    case '*':
        cout << x << "*" << y << "=" << x * y;
        break;
    case '/':
        cout << x << "/" << y << "=" << x / y;
        break;
    default:
        cout << "ERROR";
        break;
    }

    return 0;
}
