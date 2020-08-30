import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types";
import Config from "./providers/config/Config";
import DotEnvConfig from "./providers/config/DotEnvConfig";
import { KeyStore, LocalKeyStore } from "./providers/Keystore";
import { Logger, STDOutLogger } from "./Log";
import { TokenHandler, JWTHandler } from "./providers/TokenHandler";
import { Database } from "./database/Database";
import { MongooseDatabase } from "./database/Database";
import { MetricCollectorInterface, PrometheusMetricCollector } from "./providers/MetricsProvider";
import { UserRespository, MongooseUserRepository } from "./database/repositories/UserRepository";
import { ReadyStatusObserver } from "./observers/ReadyStatusObserver";
import { IFileRepository, MongooseFileRepository } from "./database/repositories/FileRepository";
import { IStorage, LocalDiskStorage } from "./providers/Storage";

const container = new Container({ autoBindInjectable: true });

container.bind<Config>(TYPES.Config).to(DotEnvConfig).inSingletonScope();
container.bind<Database>(TYPES.Database).to(MongooseDatabase).inSingletonScope();
container.bind<KeyStore>(TYPES.KeyStore).to(LocalKeyStore).inRequestScope();
container.bind<Logger>(TYPES.Logger).to(STDOutLogger).inSingletonScope();
container.bind<TokenHandler>(TYPES.TokenHandler).to(JWTHandler).inRequestScope();
container.bind<MetricCollectorInterface>(TYPES.MetricCollector).to(PrometheusMetricCollector).inSingletonScope();
container.bind<ReadyStatusObserver>(ReadyStatusObserver).toSelf().inSingletonScope();

container.bind<IStorage>(TYPES.Storage).to(LocalDiskStorage).inSingletonScope();
/**
 * Repositories
 */
container.bind<UserRespository>(TYPES.UserRepository).to(MongooseUserRepository);
container.bind<IFileRepository>(TYPES.FileRepository).to(MongooseFileRepository);

export { container };