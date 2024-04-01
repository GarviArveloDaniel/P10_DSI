# Práctica 9 - Aplicación para coleccionistas de cartas Magic

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-GarviArveloDaniel/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-GarviArveloDaniel?branch=main) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-GarviArveloDaniel&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-GarviArveloDaniel) [![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-GarviArveloDaniel/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-GarviArveloDaniel/actions/workflows/tests.yml)

**Información de contacto:**
  - Daniel Garvi Arvelo
    - GitHub: [@GarviArveloDaniel](https://github.com/GarviArveloDaniel)
    - Email: [alu0101501338@ull.edu.es](mailto:alu0101501338@ull.edu.es)

## 🌳 Estructura del repositorio
```shell
.
├── Collections
│   └── edusegre
│       └── 1
├── package.json
├── package-lock.json
├── README.md
├── sonar-project.properties
├── src
│   ├── ejercicio-pe
│   │   ├── abstract_operation.ts
│   │   ├── filter_map_add_reduce.ts
│   │   ├── filter_map_div_reduce.ts
│   │   ├── filter_map_prod_reduce.ts
│   │   └── filter_map_sub_reduce.ts
│   ├── index.ts
│   └── magic_app
│       ├── card_interface.ts
│       ├── card.ts
│       ├── card_utilities.ts
│       └── collection.ts
├── tests
│   ├── ejercicio-pe-tests
│   │   └── ejercicio-pe.spec.ts
│   └── tests_magic_app
│       └── magic_app.spec.ts
└── tsconfig.json

8 directories, 18 files
```

## 📚Introducción

En esta práctica trabajaremos con dos nuevos paquetes: `chalk` y `yargs` para poder añadir estilos a la salida y poder interactuar con el programa por línea de comandos respectivamente. Además, haremos uso de la API **síncrona** de Node para manejar ficheros. La aplicación consiste en ofrecer una serie de métodos a distintos usuarios para poder gestionar sus colecciones de cartas magic.

## 📋Tareas Previas

Al igual que en prácticas anteriores, en primer lugar acepto la tarea de github Classroom para poder acceder al repositorio, realizo la misma configuración que en la práctica anteior y además instalo los paquetes `chalk` y `yargs`.

## Enunciado

Debemos diseñar una aplicación para coleccionistas de cartas magic. La aplicación, diseñada para ser utilizada exclusivamente desde la línea de comandos, permitirá a múltiples usuarios interactuar con sus respectivas colecciones, ofreciendo funciones para añadir, modificar, eliminar, listar y mostrar información detallada de las cartas. Cada carta se describirá con atributos como ID único, nombre, coste de maná, color, tipo, rareza, texto de reglas, fuerza/resistencia (en caso de ser criatura), marcas de lealtad (para Planeswalkers) y valor de mercado. Antes de añadir o modificar una carta, se realizarán verificaciones para evitar duplicados o errores, y al listar las cartas, se utilizará el paquete chalk para mostrar los colores correspondientes. Las cartas se almacenarán como archivos JSON individuales en un directorio nombrado según el usuario, utilizando la API síncrona de Node.js para el manejo de ficheros.

## Implementación

### Implementación Card

Se desarrolla la clase `Card` que a su vez implementa la interfaz `CardInterface` que lista todos los atributos que debe poseer una carta Magic, además, se crean una serie de enums `Color`, `CardType` y `Rarity` que limitan las opciones de ciertos atributos.

```ts
export class Card implements CardInterface {
  constructor(
    public id: number,
    public name: string,
    public manaCost: number,
    public color: Color,
    public type: CardType,
    public rarity: Rarity,
    public rulesText: string,
    public marketValue: number,
    public strengthResitance?: StrengthResistanceType,
    public loyalty?: number
  ) {}
}
```
### Card utilities

También se desarrollaron dos funciones para facilitar la impresión de la información de las cartas en el formato adecuado:

  - `colorString`:
  ```ts
  export function colorString(color:string, cadena:string) {
    switch(color) {
      case 'white':
        return chalk.white(cadena);
      case 'blue':
        return chalk.blue(cadena);
      case 'black':
        return chalk.black(cadena);
      case 'red':
        return chalk.red(cadena);
      case 'green':
        return chalk.green(cadena);
      case 'colorless':
        return chalk.white(cadena);
      case 'multi':
        return chalk.white(cadena);
      default:
        return chalk.white(cadena);
    }
  }
  ```

  - `printCard`:
  ```ts
  export function printCard(card: CardInterface) {
    console.log(chalk.white.underline.bgBlack("Card Details"));
    console.log(`Card ID: ${card.id}`);
    console.log(`Card Name: ${card.name}`);
    console.log(`Card Color: ${colorString(card.color, card.color)}`);
    console.log(`Card Type: ${card.type}`);
    console.log(`Card Rarity: ${card.rarity}`);
    console.log(`Card Market Value: ${card.marketValue}`);
    console.log(`Card Rules Text: ${card.rulesText}`);
    if(card.strengthResitance) {
      console.log(`Card Strength: ${card.strengthResitance[0]}`);
      console.log(`Card Resistance: ${card.strengthResitance[1]}`);
    }
    if(card.loyalty) {
      console.log(`Card Loyalty: ${card.loyalty}`);
    }
    console.log('---------------------------------');
  }
  ```

### Collection

Se desarrolla una clase `Collection` con único atributo el path al directorio donde se almacenarán las colecciones. La clase presenta además cinco métodos:

  - `add`:
  ```ts
  public add(username: string, card: CardInterface) {
    if(!fs.existsSync(this.fullPath + `/${username}`)) {
      fs.mkdirSync(this.fullPath + `/${username}`);
    }
    if(!fs.existsSync(this.fullPath + `/${username}/${card.id}`)) {
      fs.writeFileSync(this.fullPath + `/${username}/${card.id}`, JSON.stringify(card));
      console.log(chalk.green(`Card with id ${card.id} added to collection`));
    } else {
      console.error(chalk.red(`Card with id ${card.id} already exists in collection`));
    }
  }
  ```
  En primer lugar comprobamos si existe el directorio con el nombre del usuario (es decir, si existe el usuario), en caso de que no, se crea un directorio con el nombre del usuario y se comprueba si la carta ya existe antes de añadirla.

  - `modify`:
  ```ts
  public modify(username: string, card: CardInterface) {
    if(fs.existsSync(this.fullPath + `/${username}/${card.id}`)) {
      fs.writeFileSync(this.fullPath + `/${username}/${card.id}`, JSON.stringify(card));
      console.log(chalk.green(`Card with id ${card.id} modified`));
    } else {
      console.error(chalk.red(`Card with id ${card.id} does not exist in collection`));
    }
  }
  ```
  Primero comprobamos si existe la carta que queremos modificar, y la modificamos, en caso contrario emitimos un error.

  - `remove`:
  ```ts
  public remove(username: string, cardId: number) {
    if(fs.existsSync(this.fullPath + `/${username}/${cardId}`)) {
      fs.unlinkSync(this.fullPath + `/${username}/${cardId}`);
      console.log(chalk.green(`Card with id ${cardId} removed from collection`));
    } else {
      console.error(chalk.red(`Card with id ${cardId} does not exist in collection`));
    }
  }
  ```
  De forma similar a la anterior, comprobamos que la carta existe y la eliminamos.

  - `list`:
  ```ts
  public list(username: string) {
    const files = fs.readdirSync(this.fullPath + `/${username}`);
    files.forEach(file => {
      const card = JSON.parse(fs.readFileSync(this.fullPath + `/${username}/${file}`).toString());
      printCard(card);
    });
  }
  ```
  Para listar todas las cartas primero cargamos todas las cartas de un usuario y luego mediante un forEach llamamos a la funcion descrita anteriormente en cardUtils para imprimir la información.

  - `read`:
  ```ts
  public read(username: string, cardId: number) {
    if(fs.existsSync(this.fullPath + `/${username}/${cardId}`)) {
      const card = JSON.parse(fs.readFileSync(this.fullPath + `/${username}/${cardId}`).toString());
      printCard(card);
    } else {
      console.error(chalk.red(`Card with id ${cardId} does not exist in collection`));
    }
  }
  ```
  Para leer una carta, comprobamos que existe el id y la imprimimos por pantalla.

Podemos comprobar que en cada caso los mensajes por la consola se muestran de color verde, y los de error en color rojo.

### Intérprete de línea de comandos en index.ts

En el archivo index.ts se ha implementado toda la funcionalidad para poder leer comandos desde la línea de comandos y realizar las acciones correspondientes. A continuación se muestra el ejemplo para el método add:

```ts
yargs(hideBin(process.argv))
.command('add', 'Adds a card to the collection', {
    username: {
      description: 'The username of the collection owner',
      type: 'string',
      demandOption: true
    },
    id: {
      description: 'The ID of the card to add',
      type: 'number',
      demandOption: true
    },
    name: {
      description: 'The name of the card to add',
      type: 'string',
      demandOption: true
    },
    manaCost: {
      description: 'The mana cost of the card to add',
      type: 'number',
      demandOption: true
    },
    color: {
      description: 'The color of the card to add',
      type: 'string',
      demandOption: true
    },
    type: {
      description: 'The type of the card to add',
      type: 'string',
      demandOption: true
    },
    rarity: {
      description: 'The rarity of the card to add',
      type: 'string',
      demandOption: true
    },
    rulesText: {
      description: 'The rules text of the card to add',
      type: 'string',
      demandOption: true
    },
    marketValue: {
      description: 'The market value of the card to add',
      type: 'number',
      demandOption: true
    },
    strength: {
      description: 'The strength of the card to add',
      type: 'number',
      demandOption: false
    },
    resistance: {
      description: 'The resistance of the card to add',
      type: 'number',
      demandOption: false
    },
    loyalty: {
      description: 'The loyalty of the card to add',
      type: 'number',
      demandOption: false
    }
  }, (argv) => {
    const collection = new Collection();
    collection.add(argv.username, {
      id: argv.id,
      name: argv.name,
      manaCost: argv.manaCost,
      color: Color[argv.color as keyof typeof Color],
      type: CardType[argv.type as keyof typeof CardType],
      rarity: Rarity[argv.rarity as keyof typeof Rarity],
      rulesText: argv.rulesText,
      marketValue: argv.marketValue,
      strengthResitance: argv.strength && argv.resistance ? [argv.strength, argv.resistance] : undefined,
      loyalty: argv.loyalty ? argv.loyalty : undefined
    });
  }).help().argv;
```

Para el resto de comandos la estructura es la misma, cambiando para cada caso, el método llamado y los comandos que se piden.

## Ejercicio de pe

### Descripción del ejercicio
El problema requería la implementación de un algoritmo que realizara operaciones de filtrado, mapeo y reducción en una lista de números. Estas operaciones debían ser implementadas sin utilizar los métodos filter, map y reduce proporcionados por TypeScript. Además, se requería que estas operaciones se implementaran utilizando el patrón de diseño template method.

### Solución implementada
La solución propuesta implementa el patrón de diseño del método de plantilla en TypeScript. En este patrón, un método en una clase base (el “método de plantilla”) define el esqueleto de un algoritmo, y uno o más métodos “gancho” son definidos para ser sobrescritos en las subclases para variar partes del algoritmo.

En nuestra implementación, la clase base abstracta `AbstractOperation` define el método de plantilla `execute()`, que realiza las operaciones de filtrado, mapeo y reducción en orden. Las operaciones de filtrado y mapeo se implementan en la clase base, mientras que la operación de reducción se deja como un método abstracto para ser implementado por las subclases.

Las subclases `FilterMapAddReduce`, `FilterMapSubReduce`, `FilterMapProdReduce` y `FilterMapDivReduce` implementan la operación de reducción con la suma, resta, producto y división, respectivamente.

También se añadieron métodos de enganche entre las operaciones de filtrado, mapeo y reducción que realizaban salidas por pantalla indicando en que punto del algoritmo se encuentra la ejecución.

## 💭Conclusiones

En el desarrollo de esta práctica hemos aprendido a usar los paquetes yargs y chalk, así como una pequeña introdución a la API síncrona para manejo de ficheros de Node.

## 🔗Bibliografía

[Guión de práctica 9](https://ull-esit-inf-dsi-2324.github.io/prct09-fiilesystem-magic-app/)

## 🛠️Herramientas
Algunas de las herramientas que se han utilizado en esta práctica son las siguientes:

<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white"/>  <img src="https://img.shields.io/badge/Github%20Actions-282a2e?style=for-the-badge&logo=githubactions&logoColor=367cfe"/> <img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white"/> <img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E"/> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/> <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=Mocha&logoColor=white"/> <img src="https://img.shields.io/badge/chai-A30701?style=for-the-badge&logo=chai&logoColor=white"/> 
